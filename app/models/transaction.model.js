const mongoose = require('mongoose');
var userEntity = require('userEntity.js');

const TransactionSchema = mongoose.Schema({
    fromUser: [
        {type: mongoose.Schema.Types.ObjectId, ref: userEntity}
    ],
    toUser: [
        {type: mongoose.Schema.Types.ObjectId, ref: userEntity}
    ],
    amount: Number,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);