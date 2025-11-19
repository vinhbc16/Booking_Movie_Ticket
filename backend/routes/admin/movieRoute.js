const express = require('express');
const router = express.Router();
const { createMovie , getAllMovie , getMovie , updateMovie , deleteMovie } = require('../../controllers/admin/movieController')
const authenticationMiddleware = require('../../middlewares/authentication')
const roleMiddleware = require('../../middlewares/role')

router.use(authenticationMiddleware,roleMiddleware(['admin']))
router.route('/').get(getAllMovie).post(createMovie)
router.route('/:id').get(getMovie).put(updateMovie).delete(deleteMovie)

module.exports = router