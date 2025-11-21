const Movie = require('../../models/Movie');
const mongoose = require('mongoose');
const { NotFoundError } = require('../../errors/custom-error');


const getAllMovieCustomer = async (req, res) => {

  const { search, page = 1, limit = 10 } = req.query; 
  const queryObject = {};

  if (search) {
    queryObject.title = { $regex: search, $options: 'i' };
  }
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const movies = await Movie.find(queryObject)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limitNum);
  const totalMovies = await Movie.countDocuments(queryObject);
  const totalPages = Math.ceil(totalMovies / limitNum);

  res.status(200).json({
    totalCount: totalMovies,
    count: movies.length,
    moviesList: movies,
    totalPages: totalPages,
    currentPage: pageNum,
  });
}


const getMovieCustomer = async (req, res) => {
  const { params: { id : movieID } } = req;
  const movie = await Movie.findById(movieID);
  if( !movie ){
    throw new NotFoundError(`No movie id with : ${movieID}`)
  }
  res.status(200).json({msg: 'success' , movie: movie })
}

module.exports = {
    getAllMovieCustomer,
    getMovieCustomer
};