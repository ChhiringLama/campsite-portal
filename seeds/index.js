// Seeding the database 
const mongoose = require("mongoose");

const cities=require('./cities');
const {places,descriptor}=require('./helper');

const Campground=require("../models/campground");
const { authorize } = require("passport");

/**Settings and Config Starts */
mongoose
  .connect("mongodb://127.0.0.1:27017/campgroundDB",{
  })
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample=(array)=>{
    return array[Math.floor(Math.random()* array.length)];
}

const difficulty=["Easy","Moderate","Challenging"]

const seedDB=async()=>{
  //Delete everything to re seed the data if anything exists already
    await Campground.deleteMany({});
    for(let i=0;i<10;i++){
      const random100=Math.floor(Math.random()*10);
      const diff=Math.floor(Math.random()*3);
      const price =Math.floor(Math.random()*200);
        const camp= new Campground({
          author:'6729dd9585529d0926b7c11f',
            location:`${cities[random100].city},${cities[random100].state}`,
            title:`${sample(descriptor)} ${sample(places)}`,
            difficulty:difficulty[diff],
           images:[
            {
              url: 'https://res.cloudinary.com/dej31pf0h/image/upload/v1730926832/Campsite/cpmol8hhziyaspbbpbkw.jpg',
              filename: 'Campsite/cpmol8hhziyaspbbpbkw',
            
            },
            {
              url: 'https://res.cloudinary.com/dej31pf0h/image/upload/v1730926832/Campsite/wy2x3jiuazuapl1txysd.jpg',
              filename: 'Campsite/wy2x3jiuazuapl1txysd',
           
            }
          ],
            description:"Lore, Epsum Jispm lorem lorem  Epsum Jispm lorem lorem   Epsum Jispm lorem lorem   Epsum Jispm lorem lorem   Epsum Jispm lorem lorem ",
            price:price
        })
        await camp.save();
    }
}

seedDB();