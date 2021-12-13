const usersRouter = require("express").Router();

const {
  getAllUsers,
  getUserById,
  postUser,
  patchUserById,
  deleteUserById,
  getListingsByUsername,
  getUserByUsername,
} = require("../controllers/UsersController");
const {
  handlesMethodNotAllowedError,
} = require("../controllers/ErrorController");

usersRouter
  .route("/:user_id")
  .get(getUserById)
  .patch(patchUserById)
  .delete(deleteUserById)
  .all(handlesMethodNotAllowedError);
usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .all(handlesMethodNotAllowedError);
usersRouter.route("/:username/listings").get(getListingsByUsername);

module.exports = usersRouter;
