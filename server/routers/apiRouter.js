const apiRouter = require("express").Router();
const listingsRouter = require("./listingsRouter");
const usersRouter = require("./usersRouter");

apiRouter.use("/listings", listingsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
