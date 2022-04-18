const CampGround = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapboxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
  let perPage = 5;
  let page = req.params.page || 1;

  const campgrounds = await CampGround.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, campgrounds) => {
      CampGround.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        // res.send(campgrounds); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
        res.render('campgrounds/index', {
          campgrounds,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocodingClient
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new CampGround(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash('success', 'Successfully created a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.showCampground = async (req, res) => {
  const campground = await CampGround.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.updateCampground = async (req, res) => {
  console.log(req.body);
  const campground = await CampGround.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...imgs);

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await campground.save();
  req.flash('success', 'Successfully updated the campground');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await CampGround.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted the campground');
  res.redirect('/campgrounds');
};
