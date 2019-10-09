const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    imgUrl: String,
    password: String,
	walletBalance: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('UserEntity', UserSchema);