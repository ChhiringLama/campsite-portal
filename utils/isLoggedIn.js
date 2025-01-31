 const isLoggedIn=(req,res,next)=>{
   
    if(!req.isAuthenticated()){
       
        req.flash('error','You must be signed in to for the requested action');
       return res.redirect('/login');
      }
      next();
  }

  module.exports=isLoggedIn;