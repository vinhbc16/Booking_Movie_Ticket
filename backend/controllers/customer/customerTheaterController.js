const Theater = require('../../models/Theater');
const mongoose = require('mongoose');
const { NotFoundError } = require('../../errors/custom-error');


const getAllTheaterCustomer = async (req, res) => {

  const { search, page = 1, limit = 10 } = req.query;
  const queryObject = {};
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const theaters = await Theater.find(queryObject)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limitNum);
  const totalTheaters = await Theater.countDocuments(queryObject);
  const totalPages = Math.ceil(totalTheaters / limitNum);

  res.status(200).json({
    totalCount: totalTheaters,
    count: theaters.length,
    theatersList: theaters,
    totalPages: totalPages,
    currentPage: pageNum,
  });
}

const getTheaterCustomer = async (req, res) => {
  const { params: { id : theaterID } } = req;
  const theater = await Theater.findById(theaterID);
    if( !theater ){
        throw new NotFoundError(`No theater id with : ${theaterID}`)
    }
    res.status(200).json({ theater: theater })
}


module.exports = {
    getAllTheaterCustomer,
    getTheaterCustomer
}
