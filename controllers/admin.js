const Campground = require("../models/campground.js");
const fuzzyMatch = require("../utils/fuzzySearch.js");
const Users = require("../models/user.js");

const showCampground = async (req, res) => {
  const campgrounds = await Campground.find({}).populate("author");
  return campgrounds;
};

const confirmUser = async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  console.log(user);
  res.render("admin/userdetail", { user });
};

const viewAdmin = async (req, res) => {
  if (req.query.search) {
    const hasValidCharacters = /[a-zA-Z0-9]/.test(req.query.search);
    if (hasValidCharacters) {
      const allCampgrounds = await Campground.find({});
      const campgrounds = allCampgrounds.filter((campground) =>
        fuzzyMatch(campground.title, req.query.search)
      );

      console.log(campgrounds);
      return res.render("admin/results", { campgrounds });
    } else {
      return res.redirect("/admin");
    }
  } else {
    const campgrounds = await showCampground();
    const today = new Date();
    const todayDay = today.getDate(); // Get current day
    const todayMonth = today.getMonth();
    const todayCampgrounds = campgrounds.filter(camp => {const postedAt = new Date(camp.postedAt); return postedAt.getDate() === todayDay && postedAt.getMonth() === todayMonth;});
    const users = await Users.find({});
    const userslength=users.length
    res.render("admin/index", { campgrounds , userslength, todayCampgrounds:todayCampgrounds.length});
  }
};

const allUser = async (req, res) => {
  const users = await Users.find({});
  console.log(users);
  res.render("admin/allusers", { users });
};

const confirmPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("author");
  res.render("admin/detail", { campground });
};

const approveCampground = async (req, res) => {
  const { id } = req.params;
  const { approved: status } = await Campground.findById(id).lean();
  const updatedStatus = !status;
  const foundCamp = await Campground.findByIdAndUpdate(id, {
    approved: updatedStatus,
  });
  console.log(foundCamp);
  req.flash("success", "Campground approval updated");
  res.redirect("/admin");
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  //Our middleware in Campground.js will be triggered here below
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground has been deleted!");
  res.redirect("/admin");
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndDelete(id);
  req.flash("success", "User has been deleted!");
  res.redirect("/admin/users");
};

module.exports = {
  viewAdmin,
  allUser,
  confirmPage,
  deleteCampground,
  deleteUser,
  confirmUser,
  approveCampground,
};
