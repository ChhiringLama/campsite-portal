const mongoose = require("mongoose");
const { findOneAndUpdate } = require("./review");
const Review = require("./review");
const Schema = mongoose.Schema;

//Proporties / datatype and structure of the document in the db
const CampgroundSchema = Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  //An array so multple img can be passed
  images: [{ url: String, filename: String }],
  description: String,
  location: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Moderate", "Challenging"],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  approved:{
    type:Boolean,
    default:false,
  },
  postedAt:{
    type:Date,
    default:Date.now,
  }
});

//doc wil be the data to be aaffected with the triggerd middleware
// ->findOneAndUpdate in this case

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  //A campground doc has review field
  if (doc) {
    //Access Review model in isolation and delete those documents where the id is in {campgrounds docs review }

    Review.deleteMany({
      _id: { $in: doc.reviews },
    })
      .then(() => {
        console.log("Successfully deleted associated reviews.");
      })
      .catch((err) => {
        console.log("Error deleting reviews: ", err);
      });
  }
});

//Model represents the interface to intereace with the database
const Campground = mongoose.model("Campground", CampgroundSchema);
//Mongoose will automatically pluralize the model name ('Campground',______) to create the corresponding collection name in MongoDB.

module.exports = Campground;
