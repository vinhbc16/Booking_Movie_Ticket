require('dotenv').config()
const mongoose = require('mongoose')
const { Schema , model } = mongoose
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = Schema({
    name: {
        type: String,
        required: [true,'Please provide name'],
        maxlength: 50
    },
    phone: {
        type: String,
        required: [true,'Please provide phone number'],
        minlength: 10
    },
    email: {
        type: String,
        required: [true,'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide a valid email'],
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    },
    dateOfBirth: {
        type: Date
    },
    sex: {
        type: String,
        enum: ['Nam','Nữ']
    },
    role: {
        type: String,
        enum: ['customer','admin','staff'],
        default: 'customer'
    }
},{ timestamps: true })

UserSchema.pre('save', async function() {
    if( !this.isModified('password') ) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.createJWT = function() {
    const token = jwt.sign({ userID: this._id , name: this.name, role: this.role}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
    return token;
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

const User = model('User', UserSchema)

module.exports = User