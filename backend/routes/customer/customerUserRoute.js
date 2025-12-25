const express = require('express');
const router = express.Router();
const { getUser , updateUser } = require('../../controllers/customer/customerUserController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')

router.use(authenticationMiddleware,roleMiddleware(['customer']))

router.route('/:id').get( getUser )
router.route('/:id').put( updateUser )

module.exports = router