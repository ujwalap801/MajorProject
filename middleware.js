const Listing= require("./models/listings.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn =(req,res,next)=>
{
 
     if(!req.isAuthenticated())
    {
        //redirectURL save
        req.session.redirectUrl = req.originalUrl;
      req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl =(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async(req,res,next)=>
{
    let { id } = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currUser._id))
        {
          req.flash("error","You are not the owner of the listing");
           return res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.validateListing=(req,res,next)=>
{
  let {error}= listingSchema.validate(req.body);
   if(error)
   {
    let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
   }
   else
   {
    next();
   }
}

module.exports.validateReview=(req,res,next)=>
{
  let {error}= reviewSchema.validate(req.body);
   if(error)
   {
    let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
   }
   else
   {
    next();
   }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
      let { id, reviewId } = req.params;
      
      // Trim leading and trailing whitespace from reviewId
      reviewId = reviewId.trim();

      let review = await Review.findById(reviewId);
      if (!review || !review.author.equals(res.locals.currUser._id)) {
          req.flash("error", "You are not the author of the review ");
          return res.redirect(`/listings/${id}`);
      }
      next();
  } catch (error) {
      // Handle any errors that might occur during the asynchronous operation
      console.error("Error in isReviewAuthor middleware:", error);
      req.flash("error", "An error occurred while checking review authorship");
      res.redirect(`/listings/${id}`);
  }
}

