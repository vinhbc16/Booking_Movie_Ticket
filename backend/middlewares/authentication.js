require("dotenv").config();
const { UnauthenticatedError } = require("../errors/custom-error");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if( !authHeader || !authHeader.startsWith('Bearer ') ){
        throw new UnauthenticatedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userID).select('-password');
    req.user = { userID: user._id , name: user.name };
    next();
    } catch (error) {
        throw new UnauthenticatedError('Not authorized to access this route');
    }

}

module.exports = authenticationMiddleware;