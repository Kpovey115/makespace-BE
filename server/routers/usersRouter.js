const usersRouter = require("express").Router();

const {
    getUserById,
    postUser,
    patchUserById,
    deleteUserById,
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
usersRouter.route("/").post(postUser).all(handlesMethodNotAllowedError);

module.exports = usersRouter;
