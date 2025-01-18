const express=require('express');
const router=express.Router();
const campgrounds=require('../controllers/campgrounds.js')

const {storage}=require('../cloudinary');
const multer=require('multer');
const upload = multer({ storage }); 

const catchAsync = require("../utils/catchAsync");
const isLoggedIn=require('../utils/isLoggedIn.js')
const isAuthorized=require('../utils/isAuthorized.js');
const validateCampground=require('../utils/validateCampground.js');

//Middleware


router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.newForm);

router.post("/",isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get("/:id/edit",isLoggedIn, isAuthorized,catchAsync(campgrounds.editForm));

router.put("/:id",isLoggedIn,isAuthorized,upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground));

router.delete("/:id",isLoggedIn, isAuthorized, catchAsync(campgrounds.deleteCampground));

module.exports=router;