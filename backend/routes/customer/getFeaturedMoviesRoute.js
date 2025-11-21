const express = require('express');
const router = express.Router();
const { getFeaturedMovies } = require('../../controllers/customer/getFeaturedMoviesController')


router.route('/').get(getFeaturedMovies)

module.exports = router