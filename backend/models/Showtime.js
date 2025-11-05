require('dotenv').config()
const mongoose = require('mongoose')
const Movie = require('./Movie')
const { Schema , model } = mongoose

const ShowtimeSchema = Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    room: { 
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    seats: [
        {
            seatNumber: { type: String, required: true },
            status: {
                type: String,
                enum: ['available', 'locked', 'booked'],
                default: 'available'
            },
            price: { type: Number, required: true }
        }
    ]
},{ timestamps: true })


const Showtime = model('Showtime', ShowtimeSchema)

module.exports = Showtime