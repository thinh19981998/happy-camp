const CampGround = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  campground.reviews.pull(review);
  await campground.save();
  req.flash('success', 'Deleted review');
  res.redirect(`/campgrounds/${campground._id}`);
};
