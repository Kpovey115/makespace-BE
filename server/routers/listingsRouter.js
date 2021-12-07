const listingsRouter = require("express").Router();
const {
  getListings,
  getListingById,
} = require("../controllers/ListingsController");
const {
  handlesMethodNotAllowedError,
} = require("../controllers/ErrorController");

listingsRouter
  .route("/:listing_id")
  .get(getListingById)
  .all(handlesMethodNotAllowedError);
listingsRouter.route("/").get(getListings).all(handlesMethodNotAllowedError);

module.exports = listingsRouter;
