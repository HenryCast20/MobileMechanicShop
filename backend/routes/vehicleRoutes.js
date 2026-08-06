const express = require ('express');
const router = express.Router();
const {getCars, addCar} = require('../controllers/vehicleController');

router.get('/', getCars); // get all the cars from the user logged in 

router.post('/', addCar); // add a car to the list 

module.exports = router;
