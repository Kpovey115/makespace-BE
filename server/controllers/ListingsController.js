const ListingModel = require("../models/ListingsModel");

exports.getListings = (req, res, next) => {
  ListingModel.find()
    .then((listings) => {
      res.status(200).send({ listings });
    })
    .catch(next);
};

exports.getListingById = (req, res, next) => {
  ListingModel.find({ _id: req.params.listing_id })
    .then((listing) => {
      res.status(200).send(listing[0]);
    })
    .catch(next);
};
