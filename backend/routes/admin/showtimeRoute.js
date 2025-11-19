const express = require('express');
const router = express.Router();
const { createShowtime , getShowtimeById , updateShowtime, deleteShowtime , getAllShowtimes_Admin } = require('../../controllers/admin/showtimeController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')


router.use(authenticationMiddleware,roleMiddleware(['admin']))

router.route('/').post(createShowtime).get(getAllShowtimes_Admin)
router.route('/:id').get(getShowtimeById).put(updateShowtime).delete(deleteShowtime)

module.exports = router;