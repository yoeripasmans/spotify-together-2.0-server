const User = require('./../models/User');

module.exports = {
  getUser: (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
      res.json(user);
    }).catch((err) => {
      res.send(404)
    });;
  },
};
