const { startOfDay , endOfDay } = require('date-fns')
const Showtime = require('../../models/Showtime')
const mongoose = require('mongoose')
const { BadRequestError } = require('../../errors/custom-error')


const getAllShowtimeCustomer = async (req,res) => {
    const { movieId , theaterId } = req.query
    let { date: dateString } = req.query
    if( !movieId ){
        throw new BadRequestError('Please provide movieId')
    }
    const date = dateString ? new Date(dateString) : new Date()
    const startDay = startOfDay(date)
    const endDay = endOfDay(date)
    
    const matchQuery = {
        'movie': new mongoose.Types.ObjectId(movieId),
        'startTime': { $gte: startDay, $lte: endDay }
    }

    // Nếu có theaterId thì lọc thêm, không thì lấy hết
    if (theaterId) {
        matchQuery['roomInfo.theater'] = new mongoose.Types.ObjectId(theaterId)
    }

    const showtimes = await Showtime.aggregate([
        {
            $lookup: {
                from: 'rooms',
                localField: 'room',
                foreignField: '_id',
                as: 'roomInfo'
            }
        },
        { $unwind: '$roomInfo' },
        {
            $lookup: { // Join thêm bảng Theater để lấy tên rạp
                from: 'theaters',
                localField: 'roomInfo.theater',
                foreignField: '_id',
                as: 'theaterInfo'
            }
        },
        { $unwind: '$theaterInfo' },
        {
            $match: matchQuery
        },
        {
            $project: { // Chọn các trường cần lấy
                _id: 1,
                startTime: 1,
                endTime: 1,
                basePrice: 1,
                room: '$roomInfo.name', // Lấy tên phòng
                roomType: '$roomInfo.roomType',
                theaterName: '$theaterInfo.name', // Lấy tên rạp
                theaterId: '$theaterInfo._id',
                // Tính số ghế trống
                totalSeats: { $size: '$seats' },
                bookedSeats: {
                    $size: {
                        $filter: {
                            input: '$seats',
                            as: 'seat',
                            cond: { $eq: ['$$seat.status', 'booked'] }
                        }
                    }
                }
            }
        },
        { $sort: { 'startTime': 1 } }
    ])
    res.status(200).json({count: showtimes.length , showtimesList: showtimes})
}

const getShowtimeCustomer = async (req,res) => {
    const { params: { id : showtimeID } } = req;
    const showtime = await Showtime.findById(showtimeID)
        .populate('movie', 'title posterUrl duration ageRating')
        .populate({
            path: 'room',
            select: 'name roomType theater', 
            populate: {
                path: 'theater',
                select: 'name address'
            }
        });

    if( !showtime ){
        throw new NotFoundError(`No showtime with id : ${showtimeID}`);
    }
    res.status(200).json({msg: 'Get showtime successfully' , showtime: showtime})
}

module.exports = {
    getAllShowtimeCustomer,
    getShowtimeCustomer
}