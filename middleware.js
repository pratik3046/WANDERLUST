

const Listing=require("./models/listing.js")

const Review=require("./models/review.js")

const ExpressError = require('./utils/ExpressError')

const { listingSchema } = require("./schema.js")

const { reviewSchema } = require("./schema.js")








module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in to create a listing")
        return res.redirect("/login")
    }

    next()
}

module.exports.savedUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.savedUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to make any changes")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

//validate review

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}

module.exports.validateListing = (req, res, next) => {
    // When using multipart/form-data, req.body structure is different
    // We need to reconstruct it for validation
    let listingData = req.body;
    
    let { error } = listingSchema.validate(listingData)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}


module.exports.isReviewAuthor=async(req,res,next)=>{

        let { id,reviewId } = req.params;
    let review =await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review ")
        return res.redirect(`/listings/${id}`)
    }
    next()

}

