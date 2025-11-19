const express = require('express');
const router = express.Router({ mergeParams: true });
const { createRoom , getAllRooms , getRoom , updateRoom , deleteRoom } = require('../../controllers/admin/roomController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')

router.use(authenticationMiddleware,roleMiddleware(['admin']))

router.route('/').get(getAllRooms).post(createRoom)
router.route('/:roomID').get(getRoom).put(updateRoom).delete(deleteRoom)

module.exports = router