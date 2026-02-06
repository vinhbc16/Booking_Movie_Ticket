const Booking = require('../../models/Booking');
const Showtime = require('../../models/Showtime');
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const { io } = require('../../socket/socket'); 
const { client } = require('../../db/redis'); 
const { UnauthenticatedError , NotFoundError , BadRequestError } = require('../../errors/custom-error')


const generateBookingCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const SEPAY_BANK = 'BIDV';
const SEPAY_ACCOUNT = '9624728EW4'; 

const createBooking = async (req, res) => {
    try {
        const { showtimeId, seats } = req.body; 
        const userId = req.user.userID;
        for (const seat of seats) {
            const key = `seat:${showtimeId}:${seat}`;
            const holder = await client.get(key);
if (!holder || holder.toString() !== userId.toString()) {
                throw new BadRequestError(`Seat ${seat} hold time has expired.`);
            }
        }

        const showtime = await Showtime.findById(showtimeId).populate('room');
        let totalPrice = 0;
        const seatDetails = [];

        for (const seatName of seats) {
            let price = showtime.basePrice; 
            
           
            const rowChar = seatName.charAt(0).toUpperCase();
            const rowIndex = rowChar.charCodeAt(0) - 65; 
            const rowNumber = rowIndex + 1;

           
            if (showtime.room.vipRows && showtime.room.vipRows.includes(rowNumber)) {
                price = showtime.basePrice * 1.5; 
            }

            if (showtime.room.coupleRows && showtime.room.coupleRows.includes(rowNumber)) {
                price = showtime.basePrice * 2;
            }


            totalPrice += price;
            seatDetails.push({ seatName, price });
        }

        const bookingCode = generateBookingCode(); 

        const newBooking = await Booking.create({
            user: userId,
            showtime: showtimeId,
            seats: seatDetails,
            totalPrice,
            bookingCode: bookingCode,
            status: 'pending',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

      
        const qrUrl = `https://qr.sepay.vn/img?acc=${SEPAY_ACCOUNT}&bank=${SEPAY_BANK}&amount=${totalPrice}&des=${bookingCode}`;

        res.status(201).json({ 
            booking: newBooking, 
            qrUrl,
            msg: 'Please complete payment to finish' 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating order' });
    }
};

const handleSePayWebhook = async (req, res) => {
    try {
        const { content, transferAmount } = req.body;
        
        console.log("Webhook SePay received:", content, transferAmount);

        if (!content) return res.status(200).json({ success: false, msg: 'No content' });

       
        const match = content.match(/[A-Z0-9]{6}/); 
        
        if (!match) {
            return res.status(200).json({ success: false, msg: 'Booking code not found in content' }); 
        }
        
        const codeFound = match[0];

        const booking = await Booking.findOne({ 
            bookingCode: codeFound, 
            status: 'pending'
        });

        if (!booking) {
            return res.status(200).json({ success: false, msg: 'Order does not exist or has already been paid' });
        }

        if (parseFloat(transferAmount) < booking.totalPrice) {
             return res.status(200).json({ success: false, msg: 'Insufficient transfer amount' });
        }

        console.log(`Payment successful for order: ${codeFound}`);

if (booking && booking.status === 'pending') {
            booking.status = 'success';
            await booking.save();
            const seatNames = booking.seats.map(s => s.seatName);
            await Showtime.updateOne(
                { _id: booking.showtime },
                { 
                    $set: { "seats.$[element].status": "booked" } 
                },
                { 
                    arrayFilters: [ { "element.seatNumber": { $in: seatNames } } ] 
                }
            );

        for (const s of booking.seats) {
            const key = `seat:${booking.showtime}:${s.seatName}`;
            await client.del(key);
            
             io.to(booking.showtime.toString()).emit('seat_sold', { seatName: s.seatName });
        }

        io.emit(`payment_success_${booking._id}`, { 
            msg: 'Payment successful!',
            bookingId: booking._id 
        });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ success: false });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        const booking = await Booking.findById(bookingId)
            .populate('showtime')
            .populate('user');
        
        if (!booking) {
             throw new NotFoundError('Booking not found');
        }
        if (!booking.user) {
             console.error("Error: Booking has user ID but could not populate (User may have been deleted)");
        }

        const dbUserId = booking.user?._id?.toString();
        const reqUserId = req.user.userID?.toString();

        if (dbUserId !== reqUserId) {
             console.log("Mismatch: User ID does not match");
             throw new UnauthenticatedError('Not authorized to view this booking');
        }        
        res.status(200).json({ booking });

    } catch (error) {
        console.error("Get Booking Error:", error);
        if (error.name === 'UnauthenticatedError') {
             res.status(401).json({ msg: error.message });
        } else {
             res.status(500).json({ msg: error.message });
        }
    }
}

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userID;
        const bookings = await Booking.find({ 
            user: new mongoose.Types.ObjectId(userId),
            status: 'success'
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'showtime',
            select: 'startTime',
            populate: [
                { path: 'movie', select: 'title posterUrl duration ageRating' },
                { 
                    path: 'room', 
                    select: 'name theater',
                    populate: { path: 'theater', select: 'name address' }
                }
            ]
        });        
        if (bookings.length === 0) {
             const anyBooking = await Booking.findOne();
             if (anyBooking) {
                 console.log("DB has tickets, but does not match your User ID.");
                 console.log("User in sample ticket:", anyBooking.user);
                 console.log("Your user:", userId);
             } else {
                 console.log("No bookings have been created in the system yet.");
             }
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Get My Bookings Error:", error);
        res.status(500).json({ msg: 'Error fetching ticket list' });
    }
};

module.exports = { createBooking, handleSePayWebhook , getBookingById , getMyBookings };