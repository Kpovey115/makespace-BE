const express = require("express");
const app = express();
app.use(express.json());
const apiRouter = require("./routers/apiRouter");
const mongoose = require("mongoose");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!ENV) {
  throw new Error("URI not set");
}

console.log(process.env.URI);
mongoose
  .connect(process.env.URI)
  .then((res) => {
    console.log(`Connection successful ${res}`);
  })
  .catch((err) => console.log(err));

app.use("/api", apiRouter);

module.exports = app;
