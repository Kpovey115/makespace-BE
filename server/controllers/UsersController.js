const UsersModel = require("../models/UsersModel");
const ListingModel = require("../models/ListingsModel");

exports.getUserById = (req, res, next) => {
  const id = req.params.user_id;
  UsersModel.findById(id)
    .then((user) => {
      if (user === null) res.status(404).json({ msg: "User not found." });
      else res.status(200).json(user);
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  let user = new UsersModel({
    username: req.body.username,
    displayName: req.body.displayName,
    emailAddress: req.body.emailAddress,
    userRating: 0,
    _id: req.body._id,
    avatar: req.body.avatar,
  });

  user
    .save()
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
};

exports.patchUserById = (req, res, next) => {
  const id = req.params.user_id;
  UsersModel.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedUser) => {
      if (updatedUser === null)
        res.status(404).json({ msg: "User not found." });
      else res.status(200).json(updatedUser);
    })
    .catch(next);
};

exports.deleteUserById = (req, res, next) => {
  const id = { _id: req.params.user_id };
  UsersModel.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (deletedUser === null)
        res.status(404).json({ msg: "User not found." });
      else res.status(204).json();
    })
    .catch(next);
};

exports.getListingsByUsername = (req, res, next) => {
  const username = { owner: req.params.username };
  ListingModel.find(username)
    .then((listings) => {
      res.status(200).json(listings);
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  UsersModel.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
};
