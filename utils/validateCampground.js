const {campgroundSchema}=require('../schemas')
const ExpressError=require('../utils/ExpressError');

const validateCampground=(req,res,next)=>{

    //campgroundSchema is a object obtained from schemas.js 

    //Validate the obtained body data from the post method using the Joi schema
    const {error} = campgroundSchema.validate(req.body);

    /**
    if an error occurs the it will make a object like below, The details is an array that contains all the errors 
    {
      value: {},
      error: [Error [ValidationError]: "title" is required] {
        _original: {},
        details: [ [Object] ]
      }
    } 
      but we are only taking "error" field as it has the message
    */

    if(error){
      const msg=error.details.map(el=> el.message).join("");
      throw new ExpressError(msg,400);
    }else{
      next()
    }
}

module.exports=validateCampground;