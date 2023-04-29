import mongoose from "mongoose";
import admin from "firebase-admin";
import serviceAccount from "./credentials.json" assert { type: "json" };
import {
  firebaseConnection,
  mongoConnection,
  nodeEnv,
  persistence,
} from "./enviroment.js";
import MessagesMongoDb from "../dao/mongoDA.js";
import { logger } from "./winston.js";
import FirebaseDAO from "../dao/firebaseDA.js";
import ArchivoDAO from "../dao/archivoDA.js";
import MemoryDAO from "../dao/memory.js";

let isConnected;
let dbDAO;

const connectToFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConnection,
  });
};

const connectToDb = async () => {
  if (!isConnected) {
    try {
      if (persistence === "memory" || nodeEnv === "test") {
        dbDAO = new MemoryDAO();
      }
      if (persistence === "archivo") {
        dbDAO = new ArchivoDAO();
      }
      if (persistence === "mongo") {
        await mongoose.connect(mongoConnection);
        dbDAO = new MessagesMongoDb();
      } else {
        connectToFirebase();
        dbDAO = new FirebaseDAO();
      }

      isConnected = true;
      return;
    } catch (e) {
      logger.error(`Error al acceder a la base de datos. ${e.message}`);
    }
  }

  return;
};

connectToDb(persistence);
export { dbDAO };
