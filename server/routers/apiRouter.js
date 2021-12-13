const apiRouter = require("express").Router();
const listingsRouter = require("./listingsRouter");
const usersRouter = require("./usersRouter");
const usernameRouter = require("../routers/usernameRouter");

apiRouter.use("/listings", listingsRouter);
apiRouter.use("/user/", usernameRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
