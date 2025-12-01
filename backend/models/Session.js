const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SessionSchema = new Schema({
    userID: {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{ timestamps: true } 
)

SessionSchema.index({'expiresAt': 1}, { 'expireAfterSeconds': 0})

const Session = model('Session', SessionSchema)
module.exports = Session