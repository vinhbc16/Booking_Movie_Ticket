const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Movie = require('../../models/Movie');
const Showtime = require('../../models/Showtime');
const { BadRequestError, NotFoundError } = require('../../errors/custom-error');

const getAllUsers = async (req, res) => {
    const { search, page = 1, limit = 10, status } = req.query; 
    const queryObject = {};
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    if (status) {
        queryObject.status = status;
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    let result = User.find(queryObject)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum);
    const users = await result;
    const totalUsers = await User.countDocuments(queryObject);
    const totalPages = Math.ceil(totalUsers / limitNum);

    res.status(200).json({
        users,
        totalUsers,
        totalPages,
        currentPage: pageNum
    });
}

const deleteUser = async (req, res) => {
    const { params: { id : userID } } = req;
    const user = await User.findByIdAndDelete(userID);
    if( !user ){
        throw new NotFoundError(`No user with id : ${userID}`);
    }
    res.status(200).json({msg: 'delete successfully' , user: user });
}
const getUserDetail = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password'); // Không trả về password
    if (!user) {
        throw new NotFoundError(`Không tìm thấy user với ID: ${id}`);
    }
    res.status(200).json({ user });
};

const updateUserByAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, phone, role, birthDate , sex } = req.body;

    if (!name || !role) {
        throw new BadRequestError('Tên và Vai trò không được để trống');
    }

    const user = await User.findByIdAndUpdate(
        id,
        { name, phone, role, birthDate , sex },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new NotFoundError(`Không tìm thấy user với ID: ${id}`);
    }

    res.status(200).json({ msg: 'Cập nhật thành công', user });
};

module.exports = {
    getAllUsers,
    deleteUser ,
    getUserDetail,
    updateUserByAdmin
}