const ListingModel = require("../models/ListingsModel");

exports.getListings = (req, res) => {
  ListingModel.find()
    .then((listings) => {
      res.status(200).send({ listings });
    })
    .catch((err) => res.json({ result: err }));
};
