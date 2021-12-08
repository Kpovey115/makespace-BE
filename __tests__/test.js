const app = require("../server/app");
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = require("mongoose");
const { seedTestDb } = require("../test-db/test-data");

beforeEach((done) => {
  mongoose.connection.collections.listings.drop(() => {
    seedTestDb();
    done();
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
          // expect(listings).to.have.lengthOf(8);
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
              "24HourAccess"
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
    describe("POST A LISTING", () => {
      it("Status: 201. Responds with a listing object with the relevant properties", () => {
        const newListing = {
          title: "Little space",
          location: { city: "Liverpool", postcode: "L1 8VH" },
          owner: "Holly May",
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
            "24HourAccess": false,
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
            "24HourAccess"
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

// describe("/api/listings/:location", () => {
//   describe("GET", () => {
//     it("Status: 200. Responds with an array of listing objects that match the input location with the relevant properties", () => {
//       return request(app)
//         .get("/api/listings/Manchester")
//         .expect(200)
//         .then(({ body }) => {
//           let { listings } = body;
//           expect(listings).to.be.an("array");
//           expect(listings).to.have.lengthOf(4);
//           listing.forEach((listingObj) => {
//             expect(Object.keys(listingObj)).to.have.lengthOf(12);
//           });
//         });
//     });
//     it("Status: 200. Responds with an array of listing objects that match the input location with the relevant properties", () => {
//       return request(app)
//         .get("/api/listings/Warrington")
//         .expect(200)
//         .then(({ body }) => {
//           let { listings } = body;
//           expect(listings).to.be.an("array");
//           expect(listings).to.have.lengthOf(1);
//           listing.forEach((listingObj) => {
//             expect(Object.keys(listingObj)).to.have.lengthOf(12);
//           });
//         });
//     });
//     it("Status: 404. Responds with an error message when the path is logical (hexidecimal) but does not exist", () => {
//       return request(app)
//         .get("/api/listings/61adfad4bacbe7ff1dfb7f2b")
//         .expect(404)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Listing not found.");
//         });
//     });
//     it("Status: 400. Responds with an error message when the path is illogical (not hexidecimal)", () => {
//       return request(app)
//         .get("/api/listings/not-a-hexidecimal")
//         .expect(400)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Invalid data entry.");
//         });
//     });
//   });
//   describe("PATCH", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .patch("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });
//   describe("PUT", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .put("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });
//   describe("POST", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .post("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });
//   describe("DELETE", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .delete("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });
// });
