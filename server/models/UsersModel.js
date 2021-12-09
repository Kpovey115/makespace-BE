const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    username: String,
    displayName: String,
    emailAddress: String,
    userRating: Number,
    avatar: String,
    _id: String,
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

module.exports = mongoose.model("user", UsersSchema);
