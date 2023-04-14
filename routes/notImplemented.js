import { Router } from "express";
import { logger } from "../config/winston.js";

const notImplementedRouter = Router();

notImplementedRouter.get("*", (req, res) => {
  const { url, method } = req;
  logger.warn(`Ruta ${method} ${url} no implementada.`);
  res.send(`Ruta ${method} ${url} no está implementada`);
});

export default notImplementedRouter;
