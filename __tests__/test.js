const app = require("../server/app");
const expect = require("chai").expect;
const request = require("supertest");

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
});
