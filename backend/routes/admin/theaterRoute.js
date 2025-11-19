const express = require('express');
const router = express.Router();
const { createTheater , getAllTheater , getTheater , updateTheater , deleteTheater } = require('../../controllers/admin/theaterController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')
const roomRoute = require('./roomRoute')


router.use(authenticationMiddleware,roleMiddleware(['admin']))

router.use('/:theaterID/rooms',roomRoute)

router.route('/').get(getAllTheater).post(createTheater)
router.route('/:id').get(getTheater).put(updateTheater).delete(deleteTheater)

module.exports = router