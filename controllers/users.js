const Users=require('../models/user.js');

const registerForm=(req,res)=>{
    res.render('users/register');
}

const ADMIN_SECRET_CODE="adminrole"

const createUser=async (req,res)=>{
    try{
    const {email,username,password,admincode}=req.body;
    const isAdmin=admincode===ADMIN_SECRET_CODE;

    const user= new Users({email,username,admin:isAdmin});
    const registeredUser=await Users.register(user, password);
        /**
         Users.register() takes user (with email and username) and password.
        It hashes the password, attaches it to the user, and saves the user to the database.
         */

    req.login(registeredUser, err=>{
        if (err) { return next(err); }
        req.flash('success','Welcome to Camp portal');
        return res.redirect('/campgrounds')
    })

  
  
    }catch(e){
        req.flash('error', 'A user with the same user name or email already exists')
        res.redirect('register')

        /**
         * passport-local-mongoose has a built-in mechanism for unique usernames. 
         * The Users.register() method checks if the username already exists in the database. 
         * If it does, it throws an error, which we catch in our catch block:
         */
    }
  
}

const loginForm=(req,res)=>{
    res.render('users/login')
}

const loginUser=(req,res)=>{
    req.flash("success", "Welcome back!");
    if(req.user.admin){     
     return res.redirect("/admin");
    }
    res.redirect("/campgrounds");
}

const logout=(req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    });
}

module.exports={registerForm,createUser,loginForm,loginUser,logout};