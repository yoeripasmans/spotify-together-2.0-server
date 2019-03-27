const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

// create a schema
var userSchema = new mongoose.Schema({
   spotifyId: String,
   displayName: String,
   username: String,
   email: String,
   images: Object,
   accessToken: String,
   profilePic: String,
   refreshToken: String,
   birthdate: Date,
   country: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
