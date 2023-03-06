import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import { dbDAO } from "./config/connectToDb.js";
import { denormalizer, normalizer } from "./utils/normalizr.js";
import MongoStore from "connect-mongo";
import { usersDAO } from "./DAOs/mongoDAOs.js";
import { compareSync, hashSync } from "bcrypt";
import { secretSession, sessionConnection } from "./config/enviroment.js";
import { configMinimist } from "./config/minimist.js";
import infoRouter from "./routes/info.js";
import randomNumbersRouter from "./routes/randomNumbers.js";
import cluster from "cluster";
import { cpus } from "os";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const timeCookie = 600000;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: sessionConnection,
      collectionName: "sessions",
    }),
    secret: secretSession,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: timeCookie,
    },
  })
);

if (cluster.isPrimary && configMinimist.modo === "cluster") {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Process ${worker.pid} died`);

    cluster.fork();
  });
} else {
  app.get("/", (req, res) => {
    if (req.session.email) {
      req.session.count++;

      req.session.cookie.maxAge = timeCookie;
      res.render("chat", {
        email: req.session.email,
      });
      return;
    }

    res.redirect("/login");
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const users = await usersDAO.getUsers();

    const user = users.find(
      (user) => user.email === email && compareSync(password, user.password)
    );

    if (!user) {
      res.status(403).render("loginError", {
        mensaje: "Datos inválidos",
      });
      return;
    }

    req.session.email = email;
    req.session.count = (req.session.count ?? 0) + 1;

    res.redirect("/");
  });

  app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    const users = await usersDAO.getUsers();

    const existUser = users.find((user) => user.email === email);

    if (existUser) {
      res.status(403).render("loginError", {
        mensaje: "El usuario ya existe",
      });
      return;
    }

    await usersDAO.addUser({ email, password: hashSync(password, 10) });

    res.redirect("/login");
  });

  app.get("/logout", (req, res) => {
    if (req.session.email) {
      const email = req.session.email;
      req.session.destroy(() => {
        res.render("logout", {
          email,
        });
      });

      return;
    }

    res.redirect("/login");
  });

  io.on("connection", async (client) => {
    const messagesArray = (await dbDAO.getMessages()) || [];

    const normalizedData = normalizer(messagesArray);

    // console.log(JSON.stringify(normalizedData, null, 2));

    const denormalizedData = denormalizer(normalizedData);

    // console.log(JSON.stringify(denormalizedData, null, 2));

    if (denormalizedData?.messages[0]?._doc) {
      let data = {
        id: "1",
        messages: [],
      };

      denormalizedData.messages.forEach((message) => {
        data.messages.push(message._doc);
      });

      // Send all messages
      client.emit("messages", data);
    } else {
      // Send all messages
      client.emit("messages", denormalizedData);
    }

    // Receive a message.
    client.on("new-message", async (message) => {
      const date = new Date().toLocaleString();

      try {
        // Add message in DataBase.
        await dbDAO.addMessage({ ...message, date });
        messagesArray.messages.push({ ...message, date });
      } catch (e) {
        console.log(e.message);
      }

      // Send the new message.
      io.sockets.emit("message-added", { ...message, date });
    });
  });

  app.use("/api/productos-test", productTestRouter);
  app.use("/info", infoRouter);
  app.use("/api/randoms", randomNumbersRouter);

  server.listen(configMinimist.puerto);
}
