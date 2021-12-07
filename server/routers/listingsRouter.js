const listingsRouter = require("express").Router();
const { getListings } = require("../controllers/ListingsController");
const {
  handlesMethodNotAllowedError,
} = require("../controllers/ErrorController");

listingsRouter.route("/").get(getListings).all(handlesMethodNotAllowedError);

module.exports = listingsRouter;
