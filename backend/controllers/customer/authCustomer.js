require('dotenv').config();
const mongoose = require('mongoose');
const { BadRequestError , UnauthenticatedError , ForbiddenError } = require('../../errors/custom-error');
const User = require('../../models/User');
const Session = require('../../models/Session')
const crypto = require('crypto')


const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if( !name || !email || !password || !phone ){
    throw new BadRequestError('Please provide name, email, password and phone')
  }
  const user = await User.create({...req.body})
  res.status(201).json({ 
      msg: 'user register successfully', 
      user: {
          userID: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      } 
  });
}

const login = async (req, res) => {
  const { email , password } = req.body;
  const refreshToken = crypto.randomBytes(64).toString('hex')
  if( !email || !password ){
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if( !user ){
    throw new UnauthenticatedError('Email or password is incorrect');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if( !isPasswordCorrect ){ 
    throw new UnauthenticatedError('Password is incorrect');
  }
  if (user.role !== 'customer') {
      throw new BadRequestError('Đây là cổng đăng nhập dành cho Khách hàng.');
  }
  const accessToken = await user.createJWT();
  await Session.deleteMany({ userID: user._id })
  await Session.create({
        userID: user._id,
        refreshToken,
        expiresAt: new Date( Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFETIME) * 24 * 60 * 60 * 1000 )
    })
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: parseInt(process.env.REFRESH_TOKEN_LIFETIME) * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ 
      msg: 'user logged in', 
      accessToken, 
      user: {
          userID: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      } 
  });
}

const logout = async (req,res) => {
  const token = req.cookies?.refreshToken;
  if( token ){
    await Session.findOneAndDelete({ refreshToken: token})
  }
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? 'None' : 'Lax',
  });
  return res.sendStatus(204)
}

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new UnauthenticatedError('No refresh token provided');
  }
  const session = await Session.findOne({ refreshToken: token });
  if (!session) {
    throw new ForbiddenError('Invalid refresh token');
  }
  if (session.expiresAt < new Date()) {
    throw new ForbiddenError('Refresh token expired');
  }
  const user = await User.findById(session.userID);
  if (!user) {
    throw new UnauthenticatedError('User not found');
  }
  const accessToken = await user.createJWT();
  return res.status(200).json({ 
      accessToken,
      user: {
          userID: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      }
  });
}

module.exports = { register, login , logout , refreshToken};