const express = require('express');
const router = express.Router();
const { register, loginUser, googleLogin,logout  } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', logout);

module.exports = router;
