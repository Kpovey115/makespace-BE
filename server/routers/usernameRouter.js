const usernameRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/UsersController");

usernameRouter.route("/:username").get(getUserByUsername);

module.exports = usernameRouter;
