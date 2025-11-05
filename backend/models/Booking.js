const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BookingSchema = new Schema({
    bookingCode: {
        type: String,
        required: true,
        unique: true
    },
    showtime: {
        type: Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Momo', 'VNPay', 'CreditCard', 'AtCounter'],
        required: true
    },
    qrCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Booking = model('Booking', BookingSchema);

module.exports = Booking;