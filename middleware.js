const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const CampGround = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to be logged in to do that');
    return res.redirect('/login');
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You are not the author of this campground');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You are not the author of this review');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
