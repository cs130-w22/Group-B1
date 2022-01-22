import express from "express";
import { connect } from "mongoose";
const app = express();
const port = 3000;

//DB connection
const MONGODB_URL = "mongodb://localhost:27017/ZoomieRoomies";
connect(MONGODB_URL).then(() => {
  console.log("Connected to database");
})
  .catch(err => {
    console.error("Failed to connect to database: ", err.message);
    process.exit(1);
  });


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});