const Room = require('../../models/Room')
const mongoose = require('mongoose')
const { BadRequestError , NotFoundError } = require('../../errors/custom-error')


const getRoomCustomer = async (req,res) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID).populate('theater', 'name');
    if( !room ){
        throw new NotFoundError(`No room id with : ${roomID} in this theater`)
    }
    res.status(200).json({msg: 'Get room successfully' , room: room })
}

module.exports = {
    getRoomCustomer
}
