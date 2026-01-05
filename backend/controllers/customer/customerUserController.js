const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Movie = require('../../models/Movie');
const Showtime = require('../../models/Showtime');
const { BadRequestError, NotFoundError } = require('../../errors/custom-error');

const getUser = async (req, res) => {
    const { params: { id : userID } } = req;
    if( !userID || userID === 'undefined' ){
        throw new BadRequestError('UserID is required');
    }
    const user = await User.findById(userID);
    res.status(200).json({ user });
}

const updateUser = async (req, res) => {
    const { params: { id : userID } } = req;
    const { role, password, ...dataToUpdate } = req.body;
    if( !userID || userID === 'undefined' ){
        throw new BadRequestError('UserID is required');
    }
    const user = await User.findByIdAndUpdate(userID, {...dataToUpdate}, { new: true, runValidators: true });
    if (!user) {
        throw new NotFoundError(`No user with id : ${userID}`);
    }
    res.status(200).json({ user });
}


module.exports = {
    getUser,
    updateUser
}