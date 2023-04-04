import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import { dbDAO } from "./config/connectToDb.js";
import { denormalizer, normalizer } from "./utils/normalizr.js";
import MongoStore from "connect-mongo";
import { secretSession, sessionConnection } from "./config/enviroment.js";
import { configMinimist } from "./config/minimist.js";
import infoRouter from "./routes/info.js";
import randomNumbersRouter from "./routes/randomNumbers.js";
import cluster from "cluster";
import { cpus } from "os";
import { logger } from "./config/winston.js";
import { timeCookie } from "./config/constans.js";
import chatRouter from "./routes/chat.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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
  io.on("connection", async (client) => {
    const messagesArray = (await dbDAO.getMessages()) || [];

    const normalizedData = normalizer(messagesArray);
    const denormalizedData = denormalizer(normalizedData);

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
  app.use("/", chatRouter);

  app.get("*", (req, res) => {
    const { url, method } = req;
    logger.warn(`Ruta ${method} ${url} no implementada.`);
    res.send(`Ruta ${method} ${url} no está implementada`);
  });

  server.listen(configMinimist.puerto);
}
