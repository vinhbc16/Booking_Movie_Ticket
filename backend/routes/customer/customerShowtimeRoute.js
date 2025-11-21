const express = require('express');
const router = express.Router();
const { getAllShowtimeCustomer , getShowtimeCustomer } = require('../../controllers/customer/customerShowtimeController')


router.route('/').get(getAllShowtimeCustomer)
router.route('/:id').get(getShowtimeCustomer)

module.exports = router