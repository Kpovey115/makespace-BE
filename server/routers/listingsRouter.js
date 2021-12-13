const listingsRouter = require("express").Router();
const {
  getListings,
  getListingById,
  postListing,
  patchListingById,
  deleteListingById,
} = require("../controllers/ListingsController");
const {
  handlesMethodNotAllowedError,
} = require("../controllers/ErrorController");

listingsRouter
  .route("/:listing_id")
  .get(getListingById)
  .patch(patchListingById)
  .delete(deleteListingById)
  .all(handlesMethodNotAllowedError);
listingsRouter
  .route("/")
  .get(getListings)
  .post(postListing)
  .all(handlesMethodNotAllowedError);

module.exports = listingsRouter;
