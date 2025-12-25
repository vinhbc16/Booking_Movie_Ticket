const express = require('express');
const router = express.Router();
const { createBooking, handleSePayWebhook , getBookingById , getMyBookings } = require('../../controllers/customer/bookingController');
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')

router.post('/sepay-webhook', handleSePayWebhook);
router.post('/', authenticationMiddleware, roleMiddleware(['customer']), createBooking);
router.get('/mine', authenticationMiddleware, roleMiddleware(['customer']), getMyBookings);
router.get('/:id', authenticationMiddleware, roleMiddleware(['customer']), getBookingById); 

module.exports = router;