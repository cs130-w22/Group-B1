import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { json } from "body-parser";
import TYPES from "./types";
import container from "./inversify.config";
import { RegistrableController } from "./src/controllers/RegistrableController";
import * as dotenv from "dotenv";

const app = express();
app.use(json());
app.use(cors());
app.options("*", cors());

dotenv.config();
const port = process.env.PORT || 5000;

//DB connection
const MONGODB_URL = process.env.DB_URL_DEV;
connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database: ", err.message);
    process.exit(1);
  });

const controllers: RegistrableController[] =
  container.getAll<RegistrableController>(TYPES.Controller);
controllers.forEach((controller) => controller.register(app));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
