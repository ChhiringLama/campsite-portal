const Joi = require("joi");

const campgroundSchema = Joi.object({
  //  if(!data.title)=>{}
  //Make a validiating schema
  title: Joi.string().min(4).max(30).required(),
  price: Joi.number().required().min(0),
  location: Joi.string().min(4).max(30).required(),
 

  description: Joi.string().required().min(0),
  difficulty:Joi.string().min(4).max(30),
  deleteImages:Joi.array(),
});

const reviewSchema = Joi.object({
  //Note that review itself is an object in this case because we are fetching the data as review["field"] from the form

  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});

module.exports = { campgroundSchema, reviewSchema };
