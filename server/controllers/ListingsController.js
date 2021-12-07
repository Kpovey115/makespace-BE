const ListingModel = require("../models/ListingsModel");

exports.getListings = (req, res, next) => {
  ListingModel.find()
    .then((listings) => {
      res.status(200).send({ listings });
    })
    .catch(next);
};

exports.getListingById = (req, res, next) => {
  const hex = /[0-9A-Fa-f]{6}/g;
  if (!hex.test(req.params.listing_id)) {
    res.status(400).send({ msg: "Invalid data entry." });
  }
  ListingModel.find({ _id: req.params.listing_id })
    .then((listing) => {
      if (listing.length < 1)
        res.status(404).send({ msg: "Listing not found." });
      res.status(200).send(listing[0]);
    })
    .catch(next);
};
