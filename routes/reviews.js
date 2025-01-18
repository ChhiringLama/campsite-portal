const express = require("express");
//Express routes do not give us easy access to params by default like accessing '/:id'. so we set {mergeParams:true} 
const router = express.Router({mergeParams:true});



const validateReview=require('../utils/validateReview.js');
const isLoggedIn=require("../utils/isLoggedIn.js")
const catchAsync=require("../utils/catchAsync.js");

const reviews=require('../controllers/reviews.js')


router.delete("/:reviewId",isLoggedIn,catchAsync(reviews.deleteReview)
);

router.post("/",isLoggedIn, validateReview, catchAsync(reviews.createReview)
);

module.exports=router;