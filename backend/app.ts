import express from "express";
import { json } from "body-parser";
import TYPES from "./types";
import container from "./inversify.config";
import { RegistrableController } from "./src/controllers/RegistrableController";

const app = express();
app.use(json());

const port = 3000;

const controllers: RegistrableController[] =
  container.getAll<RegistrableController>(TYPES.Controller);
controllers.forEach((controller) => controller.register(app));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
