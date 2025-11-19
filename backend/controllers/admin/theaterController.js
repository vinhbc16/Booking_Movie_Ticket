const Showtime = require('../models/Showtime');
const Theater = require('../models/Theater');
const Room = require('../models/Room')
const mongoose = require('mongoose');
const { NotFoundError , BadRequestError } = require('../errors/custom-error');


const createTheater = async (req, res) => {
    const { name , address } = req.body;
    if( !name || !address ){
        throw new BadRequestError('Please provide name and address')
    }
    const theater = await Theater.create({name,address});
    res.status(201).json({msg: 'Create theater successfully' , theater: theater});
}

// const getAllTheater = async (req, res) => {
//   const theaters = await Theater.find().sort('-updatedAt');
//   res.status(200).json({ count: theaters.length, theatersList: theaters });
// }
const getAllTheater = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query; // Nhận query params

  const queryObject = {};

  // Thêm logic tìm kiếm (tìm theo tên hoặc địa chỉ)
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }

  // Logic phân trang
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Thực thi query
  let result = Theater.find(queryObject)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limitNum);

  const theaters = await result;

  // Lấy tổng số document để tính totalPages
  const totalTheaters = await Theater.countDocuments(queryObject);
  const totalPages = Math.ceil(totalTheaters / limitNum);

  res.status(200).json({
    totalCount: totalTheaters,
    count: theaters.length,
    theatersList: theaters, // Giống BE của bạn
    totalPages: totalPages,
    currentPage: pageNum,
  });
}

const getTheater = async (req, res) => {
  const { params: { id : theaterID } } = req;
  const theater = await Theater.findById(theaterID);
    if( !theater ){
        throw new NotFoundError(`No theater id with : ${theaterID}`)
    }
    res.status(200).json({ theater: theater })
}

const updateTheater = async (req, res) => {
  const { params: { id : theaterID } } = req;
  const theater = await Theater.findByIdAndUpdate(
    theaterID, 
    {...req.body}, 
    { new: true, runValidators: true });
    if( !theater ){
        throw new NotFoundError(`No theater with id : ${theaterID}`);
    }
    res.status(200).json({msg: 'update successfully' , theater: theater });
}

const deleteTheater = async (req, res) => {
    const { params: { id : theaterID } } = req;
    const roomsInTheater = await Room.find({ theater: theaterID}).select('_id')
    if( roomsInTheater.length > 0 ){
        const roomIds = roomsInTheater.map( room => room._id )
        const showtimeWithRooms = await Showtime.findOne({ 
            'room': { $in: roomIds },
            'seats.status': 'booked' })
            if( showtimeWithRooms ){
                throw new BadRequestError('Cannot delete theater that has booked showtime')
            }
    }

    const theater = await Theater.findByIdAndDelete(theaterID);
    if( !theater ){
        throw new NotFoundError(`No theater with id : ${theaterID}`);
    }
    res.status(200).json({msg: 'delete successfully' , theater: theater });
}

module.exports = {
    createTheater,
    getAllTheater,
    getTheater,
    updateTheater,
    deleteTheater
};