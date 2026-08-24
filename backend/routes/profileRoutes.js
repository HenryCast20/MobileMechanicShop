const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');
const verifyToken = require('../middleware/auth');

router.put('/', verifyToken, updateProfile);

module.exports = router;
