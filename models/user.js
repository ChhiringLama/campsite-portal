const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  admin:{
    type:Boolean,
    default:false,
  }
});



//The passportLocalMongoose automatically adds the password and username field for us in the schema
userSchema.plugin(passportLocalMongoose);
const user = mongoose.model("User", userSchema);
module.exports = user;
