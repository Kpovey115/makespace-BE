const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmenitiesSchema = new Schema({
  power: Boolean,
  accessible: Boolean,
  parking: Boolean,
  indoor: Boolean,
  outdoor: Boolean,
  WC: Boolean,
  kitchen: Boolean,
  "24HourAccess": Boolean,
});

const ReviewsSchema = new Schema({
  username: String,
  ownerRating: Number,
  SpaceRating: Number,
  Body: String,
});

const ContactDetailsSchema = new Schema({
  phoneNumber: Number,
  emailAddress: String,
});

const LocationSchema = new Schema({
  city: String,
  postCode: String,
});

const ListingSchema = new Schema({
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
  images: Array,
});

module.exports = mongoose.model("listing", ListingSchema);
