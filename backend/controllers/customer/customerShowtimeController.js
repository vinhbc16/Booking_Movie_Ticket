const { startOfDay , endOfDay } = require('date-fns')
const Showtime = require('../../models/Showtime')
const mongoose = require('mongoose')
const { BadRequestError } = require('../../errors/custom-error')


const getAllShowtimeCustomer = async (req,res) => {
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
                'startTime': { $gte: startDay , $lte: endDay}
            }
        },
        {
            $sort: { 'startTime': 1 }
        }
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