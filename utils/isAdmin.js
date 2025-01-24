const isAdmin=async(req,res,next)=>{
    if(!req.user.admin){
      req.flash('error','You are not permitted for the requested action');
      return res.redirect(`/campgrounds`)
    }
    next();
  }

  module.exports=isAdmin;