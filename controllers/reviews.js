const Campground = require("../models/campground");
const Review = require("../models/review");

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  //Pull out the value of reviews field where the value == reviewId
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review has been deleted!");
  res.redirect(`/campgrounds/${id}`);
};

const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  // The review obtained from the req in this case will be a object
  //because we have formatted as ->  review[rating] in show.ejs
  const review = new Review(req.body.review);

  //Logged in user makes a review
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Revew has been made!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports = { deleteReview, createReview };
