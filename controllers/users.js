const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to YelpCamp ' + username);
      res.redirect('/campgrounds');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  req.flash('success', 'Welcome back ' + req.user.username);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
};
