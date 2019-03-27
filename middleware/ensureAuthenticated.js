module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('not signed in');
};
