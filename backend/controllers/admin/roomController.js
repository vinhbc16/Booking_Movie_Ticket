const Showtime = require('../../models/Showtime')
const Room = require('../../models/Room')
const mongoose = require('mongoose')
const { BadRequestError , NotFoundError } = require('../../errors/custom-error')

const createRoom = async (req,res) => {
    const { theaterID } = req.params; 
    const { name, numberOfRows, seatsPerRow } = req.body;
    if( !name || !numberOfRows || !seatsPerRow ){
        throw new BadRequestError('Please provide name, numberOfRows and seatsPerRow')
    }
    if( !theaterID ){
        throw new BadRequestError('Theater ID is missing from URL')
    }

    const room = await Room.create({
        ...req.body,
        theater: theaterID
    })

    res.status(201).json({msg: 'Create room successfully' , room: room})
}


const getAllRooms = async (req,res) => {
    const { theaterID } = req.params;
    const { search, page = 1, limit = 5 } = req.query; 

    if( !theaterID ){
        throw new BadRequestError('Please provide theaterId')
    }

    const queryObject = { theater: theaterID };

    if (search) {
      queryObject.name = { $regex: search, $options: 'i' };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const rooms = await Room.find(queryObject)
      .sort('-updatedAt')
      .skip(skip)
      .limit(limitNum);
    
    const totalRooms = await Room.countDocuments(queryObject);
    const totalPages = Math.ceil(totalRooms / limitNum);

    res.status(200).json({ 
      totalCount: totalRooms,
      count: rooms.length, 
      roomsList: rooms,
      totalPages: totalPages,
      currentPage: pageNum
    });
}

const getRoom = async (req,res) => {
    const { theaterID, roomID } = req.params;
    const room = await Room.findOne({_id: roomID, theater: theaterID})
    if( !room ){
        throw new NotFoundError(`No room id with : ${roomID} in this theater`)
    }
    res.status(200).json({msg: 'Get room successfully' , room: room })
}

const updateRoom = async (req,res) => {
    const { theaterID, roomID } = req.params;

    const room = await Room.findOneAndUpdate(
        { _id: roomID, theater: theaterID }, 
        {...req.body},
        { new: true, runValidators: true }
    )
    if( !room ){
        throw new NotFoundError(`No room with id : ${roomID} in this theater`);
    }
    res.status(200).json({msg: 'Update room successfully' , room: room})
}

const deleteRoom = async (req,res) => {
    const { theaterID, roomID } = req.params;
    const bookedShowtime = await Showtime.findOne({
        room: roomID,
        'seats.status': 'booked'
    })
    if( bookedShowtime ){
        throw new BadRequestError('Cannot delete room that has booked showtime')
    }

    const room = await Room.findOneAndDelete({ _id: roomID, theater: theaterID })
    if( !room ){
        throw new NotFoundError(`No room with id : ${roomID} in this theater`);
    }
    res.status(200).json({msg: 'Delete room successfully' , room: room})
}

module.exports = {
    createRoom,
    getAllRooms,
    getRoom,
    updateRoom,
    deleteRoom
}