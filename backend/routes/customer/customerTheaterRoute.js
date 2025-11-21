const express = require('express');
const router = express.Router();
const { getAllTheaterCustomer , getTheaterCustomer } = require('../../controllers/customer/customerTheaterController')


router.route('/').get(getAllTheaterCustomer)
router.route('/:id').get(getTheaterCustomer)

module.exports = router