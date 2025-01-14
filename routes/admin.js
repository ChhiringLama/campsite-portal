const express=require('express');
const router=express.Router();
const Users=require('../models/user.js');
const Campground=require('../models/campground.js');
const admins=require('../controllers/admin.js');
const catchAsync = require("../utils/catchAsync");
const isLoggedIn=require('../utils/isLoggedIn.js')
const isAdmin=require('../utils/isAdmin.js');




router.get('/',isLoggedIn,isAdmin,catchAsync(admins.viewAdmin))

router.get('/users',isLoggedIn,isAdmin,catchAsync(admins.allUser))
  
router.put('/:id',isLoggedIn,isAdmin,catchAsync(admins.approveCampground))

router.get('/:id',isLoggedIn,isAdmin,catchAsync(admins.confirmPage))

router.delete('/:id',isLoggedIn,isAdmin,catchAsync(admins.deleteCampground))


router.get('/userdetail/:id',isLoggedIn,isAdmin,catchAsync(admins.confirmUser))

router.delete('/users/:id',isLoggedIn,isAdmin,catchAsync(admins.deleteUser))



module.exports=router;