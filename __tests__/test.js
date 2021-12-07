const app = require("../server/app");
const expect = require("chai").expect;
const request = require("supertest");

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
  describe("GET", () => {
    it("Status: 200, Responds with an array of listing objects", () => {
      return request(app)
        .get("/api/listings")
        .expect(200)
        .then(({ body }) => {
          const { listings } = body;

          expect(listings).to.be.an("array");
          expect(listings).to.have.lengthOf(7);
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
            expect(listingObj.location).to.deep.nested.keys(
              "city",
              "postcode",
              "_id"
            );
            expect(listingObj.amenities).to.be.an("object");
            expect(listingObj.amenities).to.deep.nested.keys(
              "_id",
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
              "_id",
              "phoneNumber",
              "emailAddress"
            );
            expect(listingObj.reviews).to.be.an("array");
            expect(listingObj.images).to.be.an("array");
          });
        });
    });
  });
  describe("PATCH", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/listings")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("PUT", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/listings")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("POST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .post("/api/listings")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("DELETE", () => {
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

describe("/api/listings/:listing_id", () => {
  describe("GET", () => {
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
          expect(listing.location).to.deep.nested.keys(
            "city",
            "postcode",
            "_id"
          );
          expect(listing.amenities).to.be.an("object");
          expect(listing.amenities).to.deep.nested.keys(
            "_id",
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
            "_id",
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
  describe("PATCH", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("PUT", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("POST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .post("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("DELETE", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .delete("/api/listings/61adfad4bacbe7ff1dfb7f2a")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
});
