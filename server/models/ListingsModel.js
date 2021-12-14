const { Decimal128, Double } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmenitiesSchema = new Schema(
  {
    power: Boolean,
    accessible: Boolean,
    parking: Boolean,
    indoor: Boolean,
    outdoor: Boolean,
    WC: Boolean,
    kitchen: Boolean,
    _24HourAccess: Boolean,
  },
  { _id: false }
);

const ReviewsSchema = new Schema({
  username: String,
  ownerRating: Number,
  SpaceRating: Number,
  Body: String,
});

const ContactDetailsSchema = new Schema(
  {
    phoneNumber: String,
    emailAddress: String,
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    city: String,
    postcode: String,
  },
  { _id: false }
);

const ListingSchema = new Schema(
  {
    title: String,
    location: LocationSchema,
    owner: String,
    price: Number,
    spaceRating: Number,
    size: String,
    description: String,
    amenities: AmenitiesSchema,
    reviews: [ReviewsSchema],
    contactDetails: ContactDetailsSchema,
    bookedDays: Array,
    images: Array,
  },
  {
    versionKey: false,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

module.exports = mongoose.model("listing", ListingSchema);
