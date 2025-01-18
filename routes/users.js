const express=require('express');
const router=express.Router();
const users=require('../controllers/users.js');

const catchAsync=require('../utils/catchAsync.js');

const passport=require('passport');


router.get('/register',users.registerForm);

router.post('/register',catchAsync(users.createUser))

router.get('/login', users.loginForm)

//Passport gives another middleware called .authenticate 
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect :'/login'}), users.loginUser)


router.get('/logout', users.logout);


module.exports=router;


/**
  passport.authenticate('local')
  This middleware uses Passport's 'local' strategy to authenticate users. The 'local' 
  strategy is typically for username/password logins, where it checks the user's credentials 
  against what's stored in the database. In your case,
  when a POST request is made to /login, Passport verifies the user's credentials.

    failureFlash: true - This option enables flash messages for failed login attempts, showing error messages when authentication fails.
    failureRedirect: '/login' - If authentication fails, this redirects the user back to the /login page.
    local vs. Other Strategies (e.g., facebook, google, etc.):

    local: This strategy is used for email/password or username/password authentication.
    facebook, google, etc., are strategies for OAuth authentication, which allows users to log in with accounts from these platforms. These strategies provide a login page hosted by the platform (like Facebook), which sends back an authorization token to the app.
 */