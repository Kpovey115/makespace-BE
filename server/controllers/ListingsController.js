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
  const id = req.params.listing_id;
  ListingModel.findById(id)
    .then((listing) => {
      if (listing === null) res.status(404).send({ msg: "Listing not found." });
      else res.status(200).send(listing);
    })
    .catch(next);
};

// exports.getListingsByLocation = (req, res, next) => {
//   ListingModel.find({ location: req.params.location })
//     .then((listings) => {
//       if (listings.length < 1)
//         res
//           .status(404)
//           .send({ msg: "There are currently no listings with that location." });
//       res.status(200).send(listings);
//     })
//     .catch(next);
// };

exports.postListing = (req, res, next) => {
  let listing = new ListingModel({
    title: req.body.title,
    location: {
      city: req.body.location.city,
      postcode: req.body.location.postcode,
    },
    owner: req.body.owner,
    price: req.body.price,
    spaceRating: 0,
    size: req.body.size,
    description: req.body.description,
    amenities: {
      power: req.body.amenities.power,
      accessible: req.body.amenities.accessible,
      parking: req.body.amenities.parking,
      indoor: req.body.amenities.indoor,
      outdoor: req.body.amenities.outdoor,
      WC: req.body.amenities.WC,
      kitchen: req.body.amenities.kitchen,
      "24HourAccess": req.body.amenities["24HourAccess"],
    },
    reviews: [],
    contactDetails: {
      phoneNumber: req.body.contactDetails.phoneNumber,
      emailAddress: req.body.contactDetails.emailAddress,
    },
    images: req.body.images,
  });

  listing
    .save()
    .then((newListing) => {
      res.status(201).json(newListing);
    })
    .catch((err) => {
      res.json({ success: false, result: err });
    });
};

exports.patchListingById = (req, res, next) => {
  const hex = /[0-9A-Fa-f]{6}/g;
  if (!hex.test(req.params.listing_id)) {
    res.status(400).send({ msg: "Invalid data entry." });
  }
  const id = req.params.listing_id;
  ListingModel.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedListing) => {
      if (updatedListing === null)
        res.status(404).send({ msg: "Listing not found." });
      else res.status(200).send(updatedListing);
    })
    .catch(next);
};

// exports.patchListingById = (req, res, next) => {
//   const hex = /[0-9A-Fa-f]{6}/g;
//   if (!hex.test(req.params.listing_id)) {
//     res.status(400).send({ msg: "Invalid data entry." });
//   }
//   const id = req.params.listing_id;
//   const body = req.body;
//   ListingModel.findByIdAndUpdate(id, body, (bod) => {
//     console.log(bod, "<-----");
//     // if (bod === null) res.status(404).send({ msg: "Listing not found." });
//     res.status(200).send(bod);
//   });
// };

exports.deleteListingById = (req, res, next) => {
  const hex = /[0-9A-Fa-f]{6}/g;
  if (!hex.test(req.params.listing_id)) {
    res.status(400).send({ msg: "Invalid data entry." });
  }
  const id = { _id: req.params.listing_id };
  ListingModel.findByIdAndDelete(id)
    .then((deletedListing) => {
      if (deletedListing === null)
        res.status(404).send({ msg: "Listing not found." });
      else res.status(204).send();
    })
    .catch(next);
};
