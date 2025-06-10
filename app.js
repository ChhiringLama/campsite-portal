if(process.env.NODE_ENV !=="production"){
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session=require('express-session');
const flash = require('connect-flash');
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const passport=require('passport');

const LocalStrategy=require('passport-local');
const User=require('./models/user');

//express.Router() -> Routes
const userRoutes=require('./routes/users');
const adminRoutes=require('./routes/admin');
const campgroundRoutes=require('./routes/campground');
const reviewsRoutes=require('./routes/reviews');

/**Settings and Config Starts */
// Establish connection
mongoose.connect(process.env.MONGO_URL, {})

//Instance of the connection that gives us more controll on the connection with methods like on and once
//to handle error
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
  secret:'asecretword',
  resave:false,
  saveUninitialized:true,

  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());

//Passport docs tells us to use this middleware
app.use(passport.session());

//authenticate() method is provided by the package
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//The ejs mate engine will also use the view directory to look up the views for injecting
app.engine("ejs", ejsMate);


/**Settings and Config ends here */

/**Routes setting*/

// First seed is already done
// app.get('/makecampground', async (req,res)=>{
//     const camp=new Campground({
//         title:"Sindhuli Dhada",
//         price:"500",
//         description:"Nature close and Perfect for Hike",
//         location:"Sindhuli"
//     });
//     await camp.save();
//     console.log("Data saved");
//     res.send(camp)
// })

app.use((req,res,next)=>{
  //req.user is a feature of passport where for every req there will be user object which will contain info 
  // of the current user
  res.locals.currentUser=req.user;

  //On every response object we will proivde success and error value thru locals.
  //This two variable will have req.flash() messages held by the key 'success and error'
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.use('/campgrounds',campgroundRoutes);
app.use('/',userRoutes);
app.use('/campgrounds/:id/reviews/',reviewsRoutes);
app.use('/admin',adminRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Both of the two middle wear is working one by one when a page or any illiegal route request is sent
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh no something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
