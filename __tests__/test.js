const app = require("../server/app");
const chai = require("chai"),
  expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");
const mongoose = require("mongoose");
const { seedTestDb } = require("../test-db/test-data");

before((done) => {
  mongoose.connection.collections.listings.drop(() => {
    mongoose.connection.collections.users.drop(() => {
      seedTestDb();
      done();
    });
  });
});

describe("app", () => {
  it("Status: 404. Responds with an error message when the path does not exist", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.deep.equal("Path not found.");
      });
  });
});

describe("/api/listings", () => {
  describe("GET ALL LISTINGS", () => {
    it("Status: 200, Responds with an array of listing objects", () => {
      return request(app)
        .get("/api/listings")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj).to.have.all.keys(
              "_id",
              "title",
              "location",
              "owner",
              "price",
              "spaceRating",
              "size",
              "description",
              "amenities",
              "reviews",
              "contactDetails",
              "images"
            );
            expect(listingObj.location).to.be.an("object");
            expect(listingObj.location).to.deep.nested.keys("city", "postcode");
            expect(listingObj.amenities).to.be.an("object");
            expect(listingObj.amenities).to.deep.nested.keys(
              "power",
              "accessible",
              "parking",
              "indoor",
              "outdoor",
              "WC",
              "kitchen",
              "_24HourAccess"
            );
            expect(listingObj.contactDetails).to.be.an("object");
            expect(listingObj.contactDetails).to.deep.nested.keys(
              "phoneNumber",
              "emailAddress"
            );
            expect(listingObj.reviews).to.be.an("array");
            expect(listingObj.images).to.be.an("array");
          });
        });
    });
    it("Status: 200, Responds with an array of filtered listing objects", () => {
      return request(app)
        .get("/api/listings?size=M")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(3);
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj.size).to.deep.equal(`M`);
          });
        });
    });
    it("Status: 200, Responds with an array of filtered listing objects for nested", () => {
      return request(app)
        .get("/api/listings?location.city=Manchester")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(4);
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj.location.city).to.deep.equal(`Manchester`);
          });
        });
    });
    it("Status: 200, Responds with an array of filtered listing objects for multiple queries", () => {
      return request(app)
        .get("/api/listings?location.city=Manchester&amenities.kitchen=false")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(3);
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj.location.city).to.deep.equal(`Manchester`);
            expect(listingObj.amenities.kitchen).to.deep.equal(false);
          });
        });
    });

    it("Status: 200, Responds with listings sorted by descending space rating by default", () => {
      return request(app)
        .get("/api/listings")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(7);
          expect(listings[0].spaceRating).to.deep.equal(4.9);
          expect(listings[6].spaceRating).to.deep.equal(3);
          expect(listings).to.be.sortedBy(`spaceRating`, {
            descending: true,
          });
        });
    });
    it("Status: 200, Responds with listings sorted by ascending/descending price", () => {
      return request(app)
        .get("/api/listings?sortby=price&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(7);
          expect(listings).to.be.sortedBy(`price`);
        });
    });

    it("Status: 200, Responds with listings sorted by ascending alphabetical title and filtered by city", () => {
      return request(app)
        .get("/api/listings?location.city=Manchester&sortby=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;
          expect(listings).to.be.an("array");
          expect(listings).to.be.sortedBy(`title`);
          expect(listings).to.have.lengthOf(4);
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj.location.city).to.deep.equal(`Manchester`);
          });
        });
    });

    describe("POST A LISTING", () => {
      it("Status: 201. Responds with a listing object with the relevant properties", () => {
        const newListing = {
          title: "Little space",
          location: { city: "Liverpool", postcode: "L1 8VH" },
          owner: "HollyJolly5",
          price: 30,
          size: "S",
          amenities: {
            power: true,
            accessible: false,
            parking: false,
            indoor: true,
            outdoor: false,
            WC: false,
            kitchen: false,
            _24HourAccess: false,
          },
          contactDetails: {
            phoneNumber: "07765897634",
            emailAddress: "hollymay@gmail.com",
          },
          description: "This is a small room.",
          images: ["i am an image"],
        };
        return request(app)
          .post("/api/listings")
          .send(newListing)
          .expect(201)
          .then(({ body }) => {
            const listing = body;
            expect(listing).to.be.an("object");
            expect(Object.keys(listing)).to.have.lengthOf(12);
            expect(listing.title).to.deep.equal("Little space");
            expect(listing.location.city).to.deep.equal("Liverpool");
            expect(listing.contactDetails.emailAddress).to.deep.equal(
              "hollymay@gmail.com"
            );
          });
      });
      it("Status: 201. Responds with a listing object with the relevant properties", () => {
        const newListing = {
          amenities: {
            _24HourAccess: true,
            WC: false,
            accessible: false,
            indoor: false,
            kitchen: false,
            outdoor: true,
            parking: false,
            power: false,
          },
          description:
            "A palace made of floating lemons that smells oddly like cucumber ",
          location: {
            city: "Manchester",
            postcode: "M2 5Kp",
          },
          price: 50,
          size: "S",
          title: "Floating-Lemon",
          contactDetails: {
            phoneNumber: "078954356548",
            emailAddress: "Scarlett@gmail.com",
          },
          owner: "ScarlettAdams",
          images: [],
        };
        return request(app)
          .post("/api/listings")
          .send(newListing)
          .expect(201)
          .then(({ body }) => {
            const listing = body;
            expect(listing).to.be.an("object");
            expect(Object.keys(listing)).to.have.lengthOf(12);
            expect(listing.title).to.deep.equal("Floating-Lemon");
            expect(listing.location.city).to.deep.equal("Manchester");
            expect(listing.contactDetails.emailAddress).to.deep.equal(
              "Scarlett@gmail.com"
            );
          });
      });
    });
    describe("PATCH - INVALID REQUEST", () => {
      it("Status: 405. Responds with an error message when the path is not allowed", () => {
        return request(app)
          .patch("/api/listings")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.deep.equal("Method not allowed.");
          });
      });
    });
    describe("PUT - INVALID REQUEST", () => {
      it("Status: 405. Responds with an error message when the path is not allowed", () => {
        return request(app)
          .put("/api/listings")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.deep.equal("Method not allowed.");
          });
      });
    });
    describe("DELETE - INVALID REQUEST", () => {
      it("Status: 405. Responds with an error message when the path is not allowed", () => {
        return request(app)
          .delete("/api/listings")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.deep.equal("Method not allowed.");
          });
      });
    });
  });
});

describe("/api/listings/:listing_id", () => {
  describe("GET LISTING BY ID", () => {
    it("Status: 200. Responds with a listing object with the relevant properties", () => {
      return request(app)
        .get("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(200)
        .then(({ body }) => {
          let listing = body;
          expect(listing).to.be.an("object");
          expect(Object.keys(listing)).to.have.lengthOf(12);
          expect(listing).to.have.all.keys(
            "_id",
            "title",
            "location",
            "owner",
            "price",
            "spaceRating",
            "size",
            "description",
            "amenities",
            "reviews",
            "contactDetails",
            "images"
          );
          expect(listing.location).to.be.an("object");
          expect(listing.location).to.deep.nested.keys("city", "postcode");
          expect(listing.amenities).to.be.an("object");
          expect(listing.amenities).to.deep.nested.keys(
            "power",
            "accessible",
            "parking",
            "indoor",
            "outdoor",
            "WC",
            "kitchen",
            "_24HourAccess"
          );
          expect(listing.contactDetails).to.be.an("object");
          expect(listing.contactDetails).to.deep.nested.keys(
            "phoneNumber",
            "emailAddress"
          );
          expect(listing.reviews).to.be.an("array");
          expect(listing.images).to.be.an("array");
        });
    });
    it("Status: 404. Responds with an error message when the path is logical (hexidecimal) but does not exist", () => {
      return request(app)
        .get("/api/listings/61adfad4bacbe7ff1dfb7f2b")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Listing not found.");
        });
    });
    it("Status: 400. Responds with an error message when the path is illogical (not hexidecimal)", () => {
      return request(app)
        .get("/api/listings/not-a-hexidecimal")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid data entry.");
        });
    });
  });
  describe("PATCH LISTING BY ID", () => {
    it("Status: 200. Responds with a listing object with the set property updated when the change is permitted", () => {
      const update = { price: 400, owner: "Bob Marley" };
      return request(app)
        .patch("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const listing = body;
          expect(listing.price).to.deep.equal(400);
        });
    });
    it("Status: 404. Responds with an error message when the path is logical (hexidecimal) but does not exist", () => {
      const update = { price: 400, owner: "Bob Marley" };
      return request(app)
        .patch("/api/listings/61adfad4bacbe7ff1dfb7f2b")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Listing not found.");
        });
    });
    it("Status: 400. Responds with an error message when the path is illogical (not hexidecimal)", () => {
      const update = { price: 400, owner: "Bob Marley" };
      return request(app)
        .patch("/api/listings/not-a-hexidecimal")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid data entry.");
        });
    });
  });
});
describe("DELETES LISTING BY ID", () => {
  it("Status: 204. Deletes the relevant listing and does not send any content back", () => {
    return request(app)
      .delete("/api/listings/61adfad4bacbe7ff1dfb7f2a")
      .expect(204);
  });
  it("Status: 404. Responds with an error message when the path is logical (hexidecimal) but does not exist", () => {
    return request(app)
      .delete("/api/listings/61adfad4bacbe7ff1dfb7f2b")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.deep.equal("Listing not found.");
      });
  });
  it("Status: 400. Responds with an error message when the path is illogical (not hexidecimal)", () => {
    return request(app)
      .delete("/api/listings/not-a-hexidecimal")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.deep.equal("Invalid data entry.");
      });
  });
});
describe("POST - INVALID REQUEST", () => {
  it("Status: 405. Responds with an error message when the path is not allowed", () => {
    return request(app)
      .post("/api/listings/61adfad4bacbe7ff1dfb7f2a")
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.deep.equal("Method not allowed.");
      });
  });
  describe("PUT - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
});

describe("/api/users", () => {
  describe("POST - new user", () => {
    it("Status: 201. Responds with a new user object", () => {
      const newUser = {
        username: "Bill123",
        displayName: "Bill Rogers",
        emailAddress: "Bill.Rogers@email.com",
        _id: "3teett43tey66d",
        avatar: "imagehere",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          const user = body;
          expect(user).to.be.an("object");
          expect(Object.keys(user)).to.have.lengthOf(6);
          expect(user.username).to.deep.equal("Bill123");
          expect(user.emailAddress).to.deep.equal("Bill.Rogers@email.com");
        });
    });
  });

  describe("PATCH - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("PUT - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("DELETE - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .delete("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
});

describe("/api/users/:user_id", () => {
  describe("GET - user by ID", () => {
    it("Status: 200. Responds with the user object from the id", () => {
      return request(app)
        .get("/api/users/61ae1c9663e6e30b007fc8f3")
        .expect(200)
        .then(({ body }) => {
          const user = body;
          expect(user.displayName).to.deep.equal("Martha Gray");
          expect(Object.keys(user)).to.have.lengthOf(6);
        });
    });
  });

  describe("PATCH - user by ID", () => {
    it("Status: 200. Responds with the updated user object from the id", () => {
      const update = { displayName: "Martha White" };
      return request(app)
        .patch("/api/users/61ae1c9663e6e30b007fc8f3")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const user = body;
          expect(user.displayName).to.deep.equal("Martha White");
          expect(Object.keys(user)).to.have.lengthOf(6);
        });
    });
  });

  describe("DELETE - user by ID", () => {
    it("Status: 200. Responds with the updated user object from the id", () => {
      const update = { displayName: "Martha White" };
      return request(app)
        .delete("/api/users/61ae1c9663e6e30b007fc8f3")
        .expect(204);
    });
  });

  describe("GET - listings by username", () => {
    it("Status: 200. Responds with an array of all the listing objects from the given user", () => {
      return request(app)
        .get("/api/users/PunkRockerJack/listings")
        .expect(200)
        .then(({ body }) => {
          const listings = body;
          expect(listings).to.be.an("array");
          expect(listings.length).to.deep.equal(1);
          listings.forEach((listingObj) => {
            expect(Object.keys(listingObj)).to.have.lengthOf(12);
            expect(listingObj).to.have.all.keys(
              "_id",
              "title",
              "location",
              "owner",
              "price",
              "spaceRating",
              "size",
              "description",
              "amenities",
              "reviews",
              "contactDetails",
              "images"
            );
            expect(listingObj.location).to.be.an("object");
            expect(listingObj.location).to.deep.nested.keys("city", "postcode");
            expect(listingObj.amenities).to.be.an("object");
            expect(listingObj.amenities).to.deep.nested.keys(
              "power",
              "accessible",
              "parking",
              "indoor",
              "outdoor",
              "WC",
              "kitchen",
              "_24HourAccess"
            );
            expect(listingObj.contactDetails).to.be.an("object");
            expect(listingObj.contactDetails).to.deep.nested.keys(
              "phoneNumber",
              "emailAddress"
            );
            expect(listingObj.reviews).to.be.an("array");
            expect(listingObj.images).to.be.an("array");
          });
        });
    });
  });

  describe("GET - all users", () => {
    it("Status: 200. Responds with an array of all the user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body;
          expect(users.length).to.deep.equal(4);
          users.forEach((user) => {
            expect(Object.keys(user)).to.have.lengthOf(6);
            expect(user).to.have.all.keys(
              "_id",
              "username",
              "displayName",
              "emailAddress",
              "userRating",
              "avatar"
            );
            expect(user.username).to.be.an("string");
            expect(user.displayName).to.be.an("string");
            expect(user.emailAddress).to.be.an("string");
            expect(user.userRating).to.be.an("number");
            expect(user.avatar).to.be.an("string");
            expect(user.emailAddress).to.be.an("string");
          });
        });
    });
  });
});
