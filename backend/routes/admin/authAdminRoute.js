const express = require('express');
const router = express.Router();
const { login , logout , refreshToken } = require('../../controllers/admin/authAdmin')

router.route('/login').post(login)
router.route('/logout').post(logout)

module.exports = router