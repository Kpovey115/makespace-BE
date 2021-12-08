const express = require("express");
const app = express();
app.use(express.json());
const apiRouter = require("./routers/apiRouter");
const { handleCustomErrors } = require("./controllers/ErrorController");

//CONNECTION
const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!ENV) {
  throw new Error("URI not set");
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    console.log(`Connection successful ${res}`);
  })
  .catch((err) => console.log(err));

//ROUTERS
app.use("/api", apiRouter);

//ERROR HANDLING
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

app.use(handleCustomErrors);

module.exports = app;
