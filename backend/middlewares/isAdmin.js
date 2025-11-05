require("dotenv").config();
const { UnauthenticatedError , ForbiddenError } = require("../errors/custom-error");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const isAdminMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if( !authHeader || !authHeader.startsWith('Bearer ') ){
        throw new UnauthenticatedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userID).select('-password');

    if (!user) {
        throw new UnauthenticatedError('Authentication invalid: User not found');
    }
    if( user.role !== 'admin'){
        throw new ForbiddenError('Access Forbidden: Admin role required')
    }

    req.user = {
        userID: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    next();

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid or expired token');
    }

}

module.exports = isAdminMiddleware;