const express = require ('express');
const router = express.Router();
const {getCars, adddCar} = require('../controllers/vehicleController');
const verifyToken = require('../middleware/userauth');

router.get('/', verifyToken, getCars); // get all the cars from the user logged in 

router.post('/', verifyToken, addCar); // add a car to the list 

module.exports = router;
