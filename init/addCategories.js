// Script to add random categories to existing listings in database
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"];

async function addCategoriesToListings() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        const listings = await Listing.find({});
        
        for (let listing of listings) {
            if (!listing.category) {
                // Assign random category
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                listing.category = randomCategory;
                await listing.save();
                console.log(`Added category "${randomCategory}" to listing: ${listing.title}`);
            }
        }

        console.log("All listings updated with categories!");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err);
        mongoose.connection.close();
    }
}

addCategoriesToListings();
