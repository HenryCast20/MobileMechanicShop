const express = require ('express');
const router = express.Router();
const {getCars, addCar, updateCar} = require('../controllers/vehicleController');
const verifyToken = require('../middleware/auth'); 

router.get('/', verifyToken, getCars); // get all the cars from the user logged in 

router.post('/',verifyToken, addCar); // add a car to the list 
router.put('/:id', verifyToken, updateCar);

module.exports = router;
