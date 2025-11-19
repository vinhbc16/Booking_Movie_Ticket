const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const { NotFoundError } = require('../errors/custom-error');



const createMovie = async (req, res) => {
    const movie = await Movie.create({...req.body});
    res.status(201).json({msg: 'Create movie successfully' , movie: movie});
}

// const getAllMovie = async (req, res) => {
//   const movies = await Movie.find().sort('-updatedAt');
//   res.status(200).json({ count: movies.length, moviesList: movies });
// }
// ... (imports)

const getAllMovie = async (req, res) => {
  // Thêm 'status' và 'limit' vào query
  const { search, page = 1, limit = 10, status } = req.query; 

  const queryObject = {};

  // 1. Thêm bộ lọc tìm kiếm
  if (search) {
    queryObject.title = { $regex: search, $options: 'i' };
  }

  // 2. THÊM BỘ LỌC STATUS (MỚI)
  if (status) {
    queryObject.status = status; // vd: 'showing'
  }

  // Logic phân trang
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Thực thi query
  let result = Movie.find(queryObject)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limitNum);

  const movies = await result;

  // Lấy tổng số document
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

// ... (giữ nguyên các hàm create, update, delete...)

const getMovie = async (req, res) => {
  const { params: { id : movieID } } = req;
  const movie = await Movie.findById(movieID);
  if( !movie ){
    throw new NotFoundError(`No movie id with : ${movieID}`)
  }
  res.status(200).json({msg: 'success' , movie: movie })
}

const updateMovie = async (req, res) => {
  const { params: { id : movieID } } = req;
  const movie = await Movie.findByIdAndUpdate(
    movieID, 
    {...req.body}, 
    { new: true, runValidators: true });
  if( !movie ){
    throw new NotFoundError(`No movie with id : ${movieID}`);
  }
  res.status(200).json({msg: 'update successfully' , movie: movie });
}

const deleteMovie = async (req, res) => {
  const { params: { id : movieID } } = req;
  const movie = await Movie.findByIdAndDelete(movieID);
  if( !movie ){
    throw new NotFoundError(`No movie with id : ${movieID}`);
  }
  res.status(200).json({msg: 'delete successfully' , movie: movie });
}

module.exports = {
    createMovie,
    getAllMovie,
    getMovie,
    updateMovie,
    deleteMovie
};