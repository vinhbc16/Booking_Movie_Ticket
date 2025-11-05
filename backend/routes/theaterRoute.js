const express = require('express');
const router = express.Router();
const { createTheater , getAllTheater , getTheater , updateTheater , deleteTheater } = require('../controllers/theaterController')
const isAdminMiddleware = require('../middlewares/isAdmin')
const roomRoute = require('./roomRoute')

router.route('/').get(getAllTheater).post(isAdminMiddleware,createTheater)
router.route('/:id').get(getTheater).put(isAdminMiddleware,updateTheater).delete(isAdminMiddleware,deleteTheater)
router.use('/:theaterID/rooms',roomRoute)

module.exports = router