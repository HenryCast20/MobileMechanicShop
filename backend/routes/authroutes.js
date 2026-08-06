const express = require('express');
const router = express.Router();
const { register, loginUser, googleLogin } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', loginUser);
router.post('/google', googleLogin);

module.exports = router;
