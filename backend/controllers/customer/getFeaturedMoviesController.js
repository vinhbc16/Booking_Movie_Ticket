const Movie = require('../../models/Movie');
const mongoose = require('mongoose');
const { NotFoundError } = require('../../errors/custom-error');


const getFeaturedMovies = async (req,res) => {
    const featuredMovies = await Movie.find({ isFeatured: true }).sort('updatedAt');
    if( !featuredMovies || featuredMovies.length === 0 ){
        throw new NotFoundError('No featured movies found');
    }
    res.status(200).json({ msg: "Get featured movies successfully" , count: featuredMovies.length , movies: featuredMovies})
}

module.exports = {
    getFeaturedMovies
}