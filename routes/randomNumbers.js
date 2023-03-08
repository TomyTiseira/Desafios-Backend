import { Router } from "express";
import { fork } from "child_process";
import { configMinimist } from "../config/minimist.js";

const randomNumbersRouter = Router();

const longProcess = fork("./helpers/longProcess.js");

randomNumbersRouter.get("/", (req, res) => {
  const { cant } = req.query;

  // res.send(`Servidor express Nginx en puerto ${PORT} - PID: ${process.pid}`);
  longProcess.send(parseInt(cant) || 100000000);

  longProcess.on("message", (message) => {
    res.end(JSON.stringify(message.arrayNumbers, null, 2));
  });
});

export default randomNumbersRouter;
