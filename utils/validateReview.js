const { reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError.js");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports=validateReview;