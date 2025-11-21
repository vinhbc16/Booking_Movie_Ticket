require('dotenv').config()
const mongoose = require('mongoose')
const { Schema , model } = mongoose


const MovieSchema = Schema({
    title: {
        type: String,
        required: [true,'Please provide movie title'],
        maxlength: 1000
    },
    description: {
        type: String,
        required: [true,'Please provide description'],
        maxlength: 5000
    },
    duration: {
        type: Number,
        required: [true,'Please provide duration']
    },
    genre: {
        type: [String],
        required: [true,'Please provide genre']
    },
    director: {
        type: String,
        required: [true,'Please provide director']
    },
    actors: {
        type: [String],
        required: [true,'Please provide actors']
    },
    language: {
        type: String,
        required: [true,'Please provide language'],
        default: 'Việt Nam'
    },
    releaseDate: {
        type: Date,
        required: [true,'Please provide release date']
    },
    status: {
        type: String,
        required: true,
        enum: ['showing', 'coming_soon', 'ended'],
        default: 'showing'
    },
    ageRating: {
        type: String,
        required: true,
        enum: ['P', 'C13', 'C16', 'C18'],
        default: 'P'
    },
    posterUrl: {
        type: String,
        required: [true,'Please provide poster URL']
    },
    trailerUrl: {
        type: String,
        required: [true, 'Please provide trailer URL']
    },
    backdropUrl: {
        type: String  
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

const Movie = model('Movie', MovieSchema)

module.exports = Movie