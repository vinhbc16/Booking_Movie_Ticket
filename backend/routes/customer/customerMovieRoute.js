const express = require('express');
const router = express.Router();
const { getAllMovieCustomer , getMovieCustomer } = require('../../controllers/customer/customerMovieController')

router.route('/').get(getAllMovieCustomer)
router.route('/:id').get(getMovieCustomer)

module.exports = router