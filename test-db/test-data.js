const ListingModel = require("../server/models/ListingsModel");
const mongoose = require("mongoose");
const UsersModel = require("../server/models/UsersModel");

const testListings = [
    {
        _id: "61adfad4bacbe7ff1dfb7f2a",
        title: "Open field",
        location: { city: "Warrington", postcode: "WA2 0DB" },
        owner: "Terry Rodgers",
        price: 30,
        spaceRating: 3.5,
        size: "XL",
        amenities: {
            power: false,
            accessible: false,
            parking: true,
            indoor: false,
            outdoor: true,
            WC: false,
            kitchen: false,
            "24HourAccess": true,
        },
        contactDetails: {
            phoneNumber: 7726819611,
            emailAddress: "trodgersfarm@gmail.com",
        },
        description:
            "A beautiful open space to absorb the Warrington nature. Ideal for sports activities and large-scale events but own power supply and equipment would be needed.",
        reviews: [],
        images: [],
    },
    {
        _id: "61adfc18bacbe7ff1dfb7f2b",
        title: "Pub function room",
        location: { city: "Oldham", postcode: "OL1 3PG" },
        owner: "Sally Havers",
        price: 90,
        spaceRating: 4.5,
        size: "M",
        amenities: {
            power: true,
            accessible: true,
            parking: true,
            indoor: true,
            outdoor: true,
            WC: true,
            kitchen: false,
            "24HourAccess": false,
        },
        contactDetails: {
            phoneNumber: 7853926174,
            emailAddress: "thekingsarms@hotmail.com",
        },
        description:
            "A quaint but useful function room in our family pub. It comes with a private bar and access to the pub's beer garden! Food can be ordered from the bar during working hours. Lovely rustic decor and hairs and tables can be provided on request.",
        reviews: [],
        images: [],
    },
    {
        _id: "61adfd6bbacbe7ff1dfb7f2c",
        title: "Jack's Garage",
        location: { city: "Macclesfield", postcode: "SK11 8QN" },
        owner: "Jack Mortiboy",
        price: 50,
        spaceRating: 3,
        size: "S",
        amenities: {
            power: true,
            accessible: true,
            parking: true,
            indoor: true,
            outdoor: false,
            WC: false,
            kitchen: false,
            "24HourAccess": true,
        },
        contactDetails: {
            phoneNumber: 7264492840,
            emailAddress: "jacksgreatgarage@gmail.com",
        },
        description:
            "A decent sized garage with room for band equipment, painting gear, photoshoot set-ups and much more! Unfortunately there's no access to a toilet but a bucket can be provided on request (extra £5).",
        reviews: [],
        images: [],
    },
    {
        _id: "61adfe9cbacbe7ff1dfb7f2d",
        title: "Martha's cute back garden",
        location: { city: "Manchester", postcode: "M21 8XM" },
        owner: "Martha Gray",
        price: 60,
        spaceRating: 4.8,
        size: "M",
        amenities: {
            power: true,
            accessible: true,
            parking: true,
            indoor: true,
            outdoor: true,
            WC: true,
            kitchen: true,
            "24HourAccess": false,
        },
        contactDetails: {
            phoneNumber: 1616438967,
            emailAddress: "marthalovesflowers@gmail.com",
        },
        description:
            "My garden is my pride and joy! I have spent many years getting it to flourish to the wonderful standard it is now. In fact, my neighbours are all so jealous! Now, you can come and enjoy my lovely space (as long as you keep off the grass haha!). I've even got a small pong that's full of frogs! Ideal for nature photography and quiet painting.",
        reviews: [],
        images: [],
    },
    {
        _id: "61adffb1bacbe7ff1dfb7f2e",
        title: "City centre events space",
        location: { city: "Manchester", postcode: "M4 1LE" },
        owner: "Thomas Smith",
        price: 210,
        spaceRating: 4.2,
        size: "L",
        amenities: {
            power: true,
            accessible: true,
            parking: false,
            indoor: true,
            outdoor: false,
            WC: true,
            kitchen: false,
            "24HourAccess": false,
        },
        contactDetails: {
            phoneNumber: 7583372859,
            emailAddress: "thecastlehotel@gmail.com",
        },
        description:
            "Large function room in a luxurious, privately owned hotel. Brilliant location right in the heart of Manchester. Accommodating for a variety of events. Contact us to discuss.",
        reviews: [],
        images: [],
    },
    {
        _id: "61ae00bcbacbe7ff1dfb7f2f",
        title: "Basement room",
        location: { city: "Manchester", postcode: "M1 7GH" },
        owner: "Roxy Chisley",
        price: 70,
        spaceRating: 4.1,
        size: "S",
        amenities: {
            power: true,
            accessible: false,
            parking: false,
            indoor: true,
            outdoor: false,
            WC: true,
            kitchen: false,
            "24HourAccess": true,
        },
        contactDetails: {
            phoneNumber: 7583726597,
            emailAddress: "roxy.c@gmail.com",
        },
        description:
            "A soundproof room in the basement of a well-known gig venue in Manchester. Ideal for band practice.",
        reviews: [],
        images: [],
    },
    {
        _id: "61ae0184bacbe7ff1dfb7f30",
        title: "Stunning rooftop terrace with city views",
        location: { city: "Manchester", postcode: "M15 4EA" },
        owner: "Chiquitita Fernando",
        price: 280,
        spaceRating: 4.9,
        size: "M",
        amenities: {
            power: true,
            accessible: true,
            parking: true,
            indoor: true,
            outdoor: true,
            WC: true,
            kitchen: false,
            "24HourAccess": false,
        },
        contactDetails: {
            phoneNumber: 7846378683,
            emailAddress: "enquiries@theterrace.co.uk",
        },
        description:
            "Looking for a classy rooftop bar for your fancy event? Well, look no further! We've got a state-of-the-art indoor bar that looks out on our well-decorated outdoor area. Under heaters and lounging on luxury furniture, you can take in the views of the city both day and night. Not to mention our eclectic mix of drink and food offers, all prepared by our wonderful waiting staff. We are here to make your event, the event of the year!",
        reviews: [],
        images: [],
    },
];

const testUsers = [
    {
        _id: "61ae1b0a63e6e30b007fc8ec",
        username: "ChiqFernando",
        emailAddress: "Chiqfernando@theterrace.co.uk",
        userRating: 4.9,
        displayName: "Chiquitita Fernando",
        avatar: "imagehere",
    },
    {
        _id: " 61ae1c0e63e6e30b007fc8f0",
        username: "FoxyRoxy",
        emailAddress: "roxy.c@gmail.com",
        userRating: 4.8,
        displayName: "Roxy Chisley",
        avatar: "imagehere",
    },
    {
        _id: "61ae1c9663e6e30b007fc8f3",
        username: "MarthaGray",
        displayName: "Martha Gray",
        emailAddress: "marthalovesflowers@gmail.com",
        userRating: 5,
        avatar: "thisisanimage",
    },
    {
        _id: "61ae1ccb63e6e30b007fc8f4",
        username: "PunkRockerJack",
        displayName: "Jack Mortiboy",
        email: "jacksgreatgarage@gmail.com",
        userRating: 4.2,
        firebaseId: "gj43gkj53",
        avatar: "thisisanimage",
    },
];

exports.seedTestDb = () => {
    testListings.forEach((object) => {
        const listing = new ListingModel(object);
        listing.save();
    });

    testUsers.forEach((object) => {
        const user = new UsersModel(object);
        user.save();
    });
};

// _id
// :
// 61ae1c0e63e6e30b007fc8f0
// username
// :
// "FoxyRoxy"
// email
// :
// "roxy.c@gmail.com"
// password
// :
// "Password123"
// userRating
// :
// 4.8
