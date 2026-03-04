const express = require('express')
const Router = express.Router()

const Listing = require("../models/listing.js")


const wrapAsync = require('../utils/wrapAsync')

const ExpressError = require('../utils/ExpressError')

const { listingSchema } = require("../schema.js")

const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listings.js")

const multer  = require('multer')

const {storage}=require("../cloudConfig.js")

const upload = multer({ storage })







//index route

Router.get("/", wrapAsync(listingController.index))

//new route
Router.get("/new", isLoggedIn,listingController.renderNewForm)

//create route
Router.post("/",
    isLoggedIn,
    upload.single('listing[image][url]'),
    validateListing, 
    wrapAsync(listingController.createListing)
)



//edit route
Router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

//update route
Router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image][url]'), wrapAsync(listingController.updateListing)
)
//delete route
Router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

//show route
Router.get("/:id", wrapAsync(listingController.showListing)
)


module.exports = Router