const Campground = require("../models/campground");
const fuzzyMatch=require('../utils/fuzzySearch');
const { cloudinary } = require("../cloudinary");
const getRecommendationsByDifficultyAndReview = require("../utils/recoalgo");

const index = async (req, res) => {
  if (req.query.search) {
  
    const hasValidCharacters = /[a-zA-Z0-9]/.test(req.query.search);
    if (hasValidCharacters) {
      // Define the fuzzy search function
     

      // Fetch all campgrounds and filter using the fuzzyMatch function
      const allCampgrounds = await Campground.find({});
      const campgrounds = allCampgrounds.filter(campground =>
        fuzzyMatch(campground.title, req.query.search)
      );

      console.log(campgrounds);
      return res.render("campgrounds/result", { campgrounds });
    } else {
      return res.redirect('/campgrounds');
    }
  } else {
    const campgrounds = await Campground.find({});
    const sortedCampgrounds = [...campgrounds].sort(
      (a, b) => b.reviews.length - a.reviews.length
    );
    const slicedCampgrounds = campgrounds.slice(0, 6);

    const mostReviewed = sortedCampgrounds.slice(0, 8);
    const recentCampgrounds = [...campgrounds].reverse().slice(0, 9);
    console.log(slicedCampgrounds);
    res.render("campgrounds/index", {
      campgrounds: slicedCampgrounds,
      mostReviewed,
      recentCampgrounds,
    });
  }
};


const newForm = (req, res) => {
  res.render("campgrounds/new");
};

const createCampground = async (req, res, next) => {
  //Once validated apply the below
  const data = req.body;
  const campground = await new Campground({
    title: data.title,
    location: data.location,
    price: data.price,
    map: data.map,
    difficulty: data.difficulty,
    description: data.description,
  });
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //req.user is a feature of passport where for every req object there will be user object which will contain info
  // of the current user
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "New Campground has been made");
  res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req, res) => {
  const { id } = req.params;

  const similarcamps=await getRecommendationsByDifficultyAndReview(id);


  //->The last chained method for 'author' is for the author of the campgorund not the reviews

  const campgrounds = await Campground.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("author");
  // console.log(campgrounds);
  if (!campgrounds) {
    req.flash("error", "Cannot find the requested campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds,similarcamps});
};

//Keep in mind and ive used plural only here (difficulties)
const difficulties = ["Easy", "Moderate", "Challenging"];

const editForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render("campgrounds/edit", { campground, difficulties });
};

const editCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const body = req.body;
  const campground = await Campground.findByIdAndUpdate(id, body);
  //req.files -> is provided by multer
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Campground has been updated!");
  res.redirect(`/campgrounds/${id}`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  //Our middleware in Campground.js will be triggered here below
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground has been deleted!");
  res.redirect("/campgrounds");
};

module.exports = {
  index,
  newForm,
  createCampground,
  showCampground,
  editForm,
  editCampground,
  deleteCampground,
};
