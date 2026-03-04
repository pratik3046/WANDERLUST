const Listing=require("../models/listing")
const { listingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError")

module.exports.index=async(req,res)=>{
const { category, search } = req.query;
let allListings;

// Build query object
let query = {};

if (category) {
    query.category = category;
}

if (search) {
    // Search in location, country, and title (case-insensitive)
    query.$or = [
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
    ];
}

allListings = await Listing.find(query);

res.render("listings/index.ejs", { 
    allListings, 
    selectedCategory: category || null,
    searchQuery: search || ''
});
}

module.exports.renderNewForm=(req, res) => {
  
    res.render("listings/new.ejs")
}

module.exports.createListing=async (req, res, next) => {

    let result = listingSchema.validate(req.body)
    console.log(result)

    if (result.error) {
        throw new ExpressError(400, result.error)
    }

    let newListing = new Listing(req.body.listing);
    
    if (req.file) {
        let url = req.file.path
        let filename = req.file.filename
        newListing.image = {url, filename}
    }

    newListing.owner=req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created :)")

    res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!")
        res.redirect("/listings")
        return;
    }
    let originalImageUrl=listing.image.url
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300,e_blur:100")



    res.render("listings/edit.ejs", { listing ,originalImageUrl});


}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!")
        return res.redirect("/listings")
    }

    // Update basic fields
    Object.assign(listing, req.body.listing);
    
    // Update image if new file uploaded
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
    }

    await listing.save()

    req.flash("success", "Listing Updated")

    res.redirect(`/listings/${id}`)
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({
          path:"reviews",
          populate:{
            path:"author",
          }
    }).populate("owner")

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!")
        res.redirect("/listings")
        return;
    }

    res.render("listings/show.ejs", { listing });

}