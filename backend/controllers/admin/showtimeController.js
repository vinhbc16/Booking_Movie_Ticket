const { startOfDay , endOfDay } = require('date-fns')
const Showtime = require('../models/Showtime')
const Movie = require('../models/Movie')
const Room = require('../models/Room')
const mongoose = require('mongoose')
const { BadRequestError , NotFoundError } = require('../errors/custom-error')

const createShowtime = async (req,res) => {
    const { movie , room , basePrice , startTime } = req.body;
    if( !movie || !room || !basePrice || !startTime ){
        throw new BadRequestError('Please provide movie , room , basePrice and startTime')
    }
    const movieData = await Movie.findById(movie)
    if( !movieData ) throw new NotFoundError('Movie not found')
    const roomData = await Room.findById(room)
    if( !roomData ) throw new NotFoundError('Room not found')

    const newStartTime = new Date(startTime)
    const newEndTime = new Date(newStartTime.getTime() + movieData.duration * 60000)
    const conflictingShowtime = await Showtime.findOne({
        room: room,
        startTime: { $lt: newEndTime },
        endTime: { $gt: newStartTime }
    })
    if( conflictingShowtime ){
        throw new BadRequestError('There is a scheduling conflict with another showtime in this room !')
    }

    const generatedSeats = []
    for( let i = 0 ; i < roomData.numberOfRows ; i++ ){
        const seatRow = String.fromCharCode(65+i)
        for( let j = 0 ; j < roomData.seatsPerRow ; j++ ){
            const seatCol = `${seatRow}${j+1}`
            let price = basePrice
            if( roomData.vipRows.includes(i+1) ){
                price *= 1.5
            }
            if( roomData.coupleRows.includes(i+1) ){
                price *= 2
            }
            generatedSeats.push({
                seatNumber: seatCol,
                status: 'available',
                price: price
            })
        }
    }

    const showtime = await Showtime.create({
        movie,
        room,
        startTime: newStartTime,
        endTime: newEndTime,
        basePrice,
        seats: generatedSeats
    })
    res.status(201).json({msg: 'Create showtime successfully' , showtime: showtime})
}

const getShowtimesByMovie = async (req,res) => {
    const { movieId , theaterId } = req.query
    let { date: dateString } = req.query
    if( !movieId || !theaterId ){
        throw new BadRequestError('Please provide movieId and theaterId')
    }
    const date = dateString ? new Date(dateString) : new Date()
    const startDay = startOfDay(date)
    const endDay = endOfDay(date)
    
    const showtimes = await Showtime.aggregate([
        {
            $lookup: {
                from: 'rooms', 
                localField: 'room',
                foreignField: '_id',
                as: 'roomInfo'
            }
        },
        {
            $unwind: '$roomInfo'
        },
        {
            $match: {
                'movie': new mongoose.Types.ObjectId(movieId),
                'roomInfo.theater': new mongoose.Types.ObjectId(theaterId),
                'startTime': { $gt: startDay , $lte: endDay}
            }
        },
        {
            $sort: { 'startTime': 1 }
        }
    ])
    res.status(200).json({count: showtimes.length , showtimesList: showtimes})
}


const getAllShowtimes_Admin = async (req, res) => {
    // Lọc theo Rạp và Ngày
    const { theaterId, date } = req.query;
    
    if (!theaterId) {
        throw new BadRequestError('Please provide theaterId');
    }

    const targetDate = date ? new Date(date) : new Date();
    const startDay = startOfDay(targetDate);
    const endDay = endOfDay(targetDate);

    // 1. Tìm tất cả các phòng thuộc rạp này
    const rooms = await Room.find({ theater: theaterId }).select('_id');
    const roomIds = rooms.map(room => room._id);

    // 2. Tìm tất cả suất chiếu thuộc các phòng đó VÀ trong ngày đã chọn
    const showtimes = await Showtime.find({
        room: { $in: roomIds },
        startTime: { $gte: startDay, $lte: endDay }
    })
    .populate('movie', 'title duration posterUrl') // Lấy thông tin phim
    .populate('room', 'name roomType') // Lấy thông tin phòng
    .sort('startTime');

    res.status(200).json({ count: showtimes.length, showtimesList: showtimes });
}

const getShowtimeById = async (req,res) => {
    const { params: { id : showtimeID } } = req;
    const showtime = await Showtime.findById(showtimeID)
    res.status(200).json({msg: 'Get showtime successfully' , showtime: showtime})
}

const updateShowtime = async (req,res) => {
    const { params: { id : showtimeID } } = req;
    const showtime = await Showtime.findByIdAndUpdate(
        showtimeID, 
        {...req.body}, 
        { new: true, runValidators: true }
    );
    if( !showtime ){
        throw new NotFoundError(`No showtime with id : ${showtimeID}`);
    }
    res.status(200).json({msg: 'Update showtime successfully' , showtime: showtime})
}

const deleteShowtime = async (req,res) => {
    const { params: { id : showtimeID } } = req;
    if( !showtimeID ) throw new BadRequestError('Please provide showtimeID')

    const showtime = await Showtime.findById(showtimeID);  
    if( !showtime ){
        throw new NotFoundError(`No showtime with id : ${showtimeID}`);
    }  
    const hasBookedSeats = showtime.seats.some(seat => seat.status === 'booked');
    if (hasBookedSeats) {
        throw new BadRequestError('Cannot delete showtime with booked seats.');
    }

    await showtime.remove();
    res.status(200).json({msg: 'Delete showtime successfully' , showtime: showtime})
}

module.exports = {
    createShowtime,
    getShowtimesByMovie,
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
    getAllShowtimes_Admin
}