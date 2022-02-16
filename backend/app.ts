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
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
