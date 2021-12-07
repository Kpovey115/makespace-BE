const listingsRouter = require("express").Router();
const { getListings } = require("../controllers/ListingsController");

listingsRouter.route("/").get(getListings);

module.exports = listingsRouter;
