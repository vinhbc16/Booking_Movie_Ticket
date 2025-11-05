const express = require('express');
const router = express.Router();
const { createMovie , getAllMovie , getMovie , updateMovie , deleteMovie } = require('../controllers/movieController')
const isAdminMiddleware = require('../middlewares/isAdmin')


router.route('/').get(getAllMovie).post(isAdminMiddleware,createMovie)
router.route('/:id').get(getMovie).put(isAdminMiddleware,updateMovie).delete(isAdminMiddleware,deleteMovie)

module.exports = router