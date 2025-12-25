require("dotenv").config();
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
    },
    seats: [{ seatName: String, price: Number }],
    totalPrice: Number,
    bookingCode: {
      type: String,
      unique: true,
    },
    paymentMethod: {
      type: String,
      default: "VietQR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "expired"],
      default: "pending",
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

BookingSchema.index(
    { expiresAt: 1 }, 
    { expireAfterSeconds: 0, partialFilterExpression: { status: 'pending' } }
);

const Booking = model("Booking", BookingSchema);
module.exports = Booking;
