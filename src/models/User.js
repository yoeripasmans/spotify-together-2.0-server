const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  spotifyId: String,
  displayName: String,
  username: String,
  email: String,
  profilePic: String,
  country: String,
  followers: Number,
  birthdate: Date,
  product: String,
  accessToken: String,
  refreshToken: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
