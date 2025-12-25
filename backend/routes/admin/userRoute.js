const express = require('express');
const router = express.Router();
const { getAllUsers , deleteUser, getUserDetail , updateUserByAdmin } = require('../../controllers/admin/userController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')

router.use(authenticationMiddleware,roleMiddleware(['admin']))
router.route('/').get( getAllUsers )
router.route('/:id').delete( deleteUser ).get(getUserDetail).put(updateUserByAdmin)
module.exports = router