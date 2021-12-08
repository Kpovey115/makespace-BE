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
    "24HourAccess": Boolean,
  },
  { _id: false }
);

const ReviewsSchema = new Schema(
  {
    username: String,
    ownerRating: Number,
    SpaceRating: Number,
    Body: String,
  },
  { _id: false }
);

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
    images: Array,
  },
  { versionKey: false }
);

module.exports = mongoose.model("listing", ListingSchema);
