const express = require('express');
const router = express.Router();
const { getForecast } = require('../controllers/weatherController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getForecast);

module.exports = router;
