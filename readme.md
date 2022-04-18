# YelpCamp

![Image 1](https://github.com/thinh19981998/happy-camp/blob/master/screenshots/indexpage.PNG)  
![Image 2](https://github.com/thinh19981998/happy-camp/blob/master/screenshots/showpage.PNG)

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features

- Users can create, edit, and remove campgrounds
- Users can review campgrounds once, and edit or remove their review

## Run it locally

1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/thinh19981998/happy-camp.git
cd yelpcamp
npm install
```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```

Run `mongod` in another terminal and `node app.js` in the terminal with the project.

Then go to [localhost:3000](http://localhost:3000/).

To get google maps working check [this](https://www.mapbox.com/) out.
