require('dotenv').config();
const mongoose = require('mongoose');
const { BadRequestError , UnauthenticatedError  } = require('../errors/custom-error');
const User = require('../models/User');


const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if( !name || !email || !password || !phone ){
    throw new BadRequestError('Please provide name, email, password and phone')
  }
  const user = await User.create({...req.body})
  const token = user.createJWT();
  res.status(201).json({ 
      msg: 'user register successfully', 
      token, 
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
  if( !email || !password ){
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if( !user ){
    throw new UnauthenticatedError('Email not registered');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if( !isPasswordCorrect ){ 
    throw new UnauthenticatedError('Password is incorrect');
  }

  const token = user.createJWT();
  res.status(200).json({ 
      msg: 'user logged in', 
      token, 
      user: {
          userID: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      } 
  });
}

module.exports = { register, login };