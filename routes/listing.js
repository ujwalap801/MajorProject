const express = require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController =require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudconfig.js"); 


const upload = multer({storage });

router
      .route("/")
      .get(wrapAsync(listingController.index))
      .post(
      isLoggedIn,
      upload.single('listing[image]'),
      validateListing,
      wrapAsync(listingController.createListing)
      );
     
//New  Router
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
     .route("/:id")
     .get(wrapAsync(listingController.showListing))
     .put(
      isLoggedIn,
      isOwner,
      upload.single('listing[image]'),
      validateListing,
     wrapAsync(listingController.updateListing)
     )
     .delete(
      isLoggedIn,
      isOwner,
      wrapAsync(listingController.destoryListing)
      );

   
//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

module.exports= router;

// Index Route
// router.get("/", wrapAsync(listingController.index));


// show Route
// router.get(
//   "/:id", 
//   wrapAsync(listingController.showListing));

  
// //Create Router
// router.post(
// "/",validateListing,
// isLoggedIn,
// wrapAsync(listingController.createListing));
  

    

// Update Route
// router.put("/:id",
//    validateListing,
//    isLoggedIn,
//    isOwner,
//      wrapAsync(listingController.updateListing));
    
// delete Route
// router.delete("/:id", 
// isLoggedIn,isOwner,wrapAsync(listingController.destoryListing));

   

