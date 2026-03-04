const express = require('express')
const Router = express.Router({ mergeParams: true })

const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

const wrapAsync = require('../utils/wrapAsync')

const ExpressError = require('../utils/ExpressError')

const {validateReview,isLoggedIn , isReviewAuthor} =require("../middleware.js")

const reviewController=require("../controllers/reviews.js")

//Reviews
//POST request
Router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//Delete Reviews 
Router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = Router
