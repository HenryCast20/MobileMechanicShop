const express = require('express');
const router = express.Router();
const { getRepairs, getRepairsByCar, getRepairById } = require('../controllers/repairController');
const verifyToken = require('../middleware/auth');

router.get('/car/:carId', verifyToken, getRepairsByCar);
router.get('/', verifyToken, getRepairs);
router.get('/:id', verifyToken, getRepairById);

module.exports = router;
