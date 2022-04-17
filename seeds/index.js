const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHeper');

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CampGround.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i <= 300; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      author: '625589811cf779bd071bc1ac',
      geometry: {
        type: 'Point',
        coordinates: [cities[random].longitude, cities[random].latitude],
      },
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, id tempore officia natus est minus atque, voluptatum dolor ab impedit reiciendis dolore quasi et. Assumenda quasi laboriosam ipsa. Quae, odio!',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dayg6s9k8/image/upload/v1650089790/YelpCamp/cbeik2cwh9hmkzy9bmyx.jpg',
          filename: 'YelpCamp/cbeik2cwh9hmkzy9bmyx',
        },
        {
          url: 'https://res.cloudinary.com/dayg6s9k8/image/upload/v1650089789/YelpCamp/v1kazhj1fkwyl4og6icg.jpg',
          filename: 'YelpCamp/v1kazhj1fkwyl4og6icg',
        },
        {
          url: 'https://res.cloudinary.com/dayg6s9k8/image/upload/v1650089789/YelpCamp/znuw0xgm45pzo626wlti.jpg',
          filename: 'YelpCamp/znuw0xgm45pzo626wlti',
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
