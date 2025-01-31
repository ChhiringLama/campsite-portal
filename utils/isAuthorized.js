
// const {campgroundSchema}=require('../schemas');
const Campground=require('../models/campground');

const isAuthorized=async(req,res,next)=>{
    const { id } = req.params;
    const campground=await Campground.findById(id); 
    if(!campground.author.equals(req.user._id) && !req.user.admin ){
      req.flash('error','You are not permitted for the requested action');
      return res.redirect(`/campgrounds/${id}`)
    }
    next();
  }
  

  module.exports=isAuthorized;