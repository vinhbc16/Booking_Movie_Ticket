require('dotenv').config()
const mongoose = require('mongoose')
const { Schema , model } = mongoose

const TheaterSchema = Schema({
    name: {
        type: String,
        required: [true,'Please provide name'],
        maxlength: 50
    },
    address: {
        type: String,
        required: [true,'Please provide address'],
        maxlength: 1000
    },
},{ timestamps: true })


const Theater = model('Theater', TheaterSchema)

module.exports = Theater