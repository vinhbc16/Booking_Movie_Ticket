const express = require('express');
const router = express.Router();
const { getRoomCustomer } = require('../../controllers/customer/customerRoomController')

router.route('/:roomID').get(getRoomCustomer)

module.exports = router