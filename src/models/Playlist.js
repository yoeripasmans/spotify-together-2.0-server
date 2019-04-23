const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    name: String,
    id: String,
    uri: String,
    artists: Array,
    album: Object,
    duration_ms: Number,
    likes: Number,
    userLiked: Array,
    addedBy: Object,
    isPlaying: Boolean,
    primaryColor: String,
}, {
    timestamps: true,
});

const playlistSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    tracks: [trackSchema],
    restricted: Boolean,
    private: Boolean,
    password: String,
    users: Array,
    activeUsers: Array,
    admins: Array,
    createdBy: Object,
    rules: Object,
    qrCodeId: String,
    isPlaying: Boolean,

}, {
    timestamps: true,
});

module.exports = mongoose.model('Playlists', playlistSchema);
