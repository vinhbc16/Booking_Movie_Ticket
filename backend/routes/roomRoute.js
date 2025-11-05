const express = require('express');
const router = express.Router({ mergeParams: true });
const { createRoom , getAllRooms , getRoom , updateRoom , deleteRoom } = require('../controllers/roomController')
const isAdminMiddleware = require('../middlewares/isAdmin')

router.route('/').get(getAllRooms).post(isAdminMiddleware,createRoom)
router.route('/:roomID').get(getRoom).put(isAdminMiddleware,updateRoom).delete(isAdminMiddleware,deleteRoom)

module.exports = router