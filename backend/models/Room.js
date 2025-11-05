require('dotenv').config()
const mongoose = require('mongoose')
const { Schema , model } = mongoose

const RoomSchema = Schema({
    name: {
        type: String,
        required: [true,'Please provide name'],
        maxlength: 50
    },
    theater: { 
        type: Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    numberOfRows: {
        type: Number,
        required: true,
    },
    seatsPerRow: {
        type: Number,
        required: true,
    },
    roomType: {
        type: String,
        enum: ['2D','3D','IMAX'],
        required: true
    },
    status: {
        type: String,
        enum: ['active','maintenance','closed'],
        default: 'active'
    },
    vipRows: {
        type: [Number],
        default: []
    },
    coupleRows: {
        type: [Number],
        default: []
    }
},{ timestamps: true })


const Room = model('Room', RoomSchema)

module.exports = Room