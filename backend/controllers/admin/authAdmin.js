require('dotenv').config();
const mongoose = require('mongoose');
const { BadRequestError , UnauthenticatedError , ForbiddenError } = require('../../errors/custom-error');
const User = require('../../models/User');
const Session = require('../../models/Session')
const crypto = require('crypto')


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
  if (user.role !== 'admin') {
      throw new UnauthenticatedError('Bạn không có quyền truy cập vào trang Quản trị.');
  }
  const accessToken = await user.createJWT();
  await Session.deleteMany({ userID: user._id }); 
  await Session.create({
        userID: user._id,
        refreshToken,
        expiresAt: new Date( Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFETIME) * 24 * 60 * 60 * 1000 )
    })
  res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: parseInt(process.env.REFRESH_TOKEN_LIFETIME) * 24 * 60 * 60 * 1000,
  })
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
    res.clearCookie('refreshTokenAdmin')
  }
  return res.sendStatus(204)
}

module.exports = { login , logout };