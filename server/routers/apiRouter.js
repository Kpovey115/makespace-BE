const apiRouter = require("express").Router();
const listingsRouter = require("./listingsRouter");

apiRouter.use("/listings", listingsRouter);

module.exports = apiRouter;
