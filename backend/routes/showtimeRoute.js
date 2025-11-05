const express = require('express');
const router = express.Router();
const { createShowtime , getShowtimesByMovie, getShowtimeById , updateShowtime, deleteShowtime } = require('../controllers/showtimeController')
const isAdminMiddleware = require('../middlewares/isAdmin')

router.route('/').post(isAdminMiddleware,createShowtime).get(getShowtimesByMovie)
router.route('/:id').get(getShowtimeById).put(isAdminMiddleware,updateShowtime).delete(isAdminMiddleware,deleteShowtime)

module.exports = router;