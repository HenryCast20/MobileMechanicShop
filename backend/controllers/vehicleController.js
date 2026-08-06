const db  = require ('../config/db');

// load the current users logged cars
const getCars = async (req, res) => {
    try{
        const customerId = req.user.customer_id;
        const [vehicles] = await db.query('SELECT * FROM vehicles WHERE customer_id = ?', [customerId])
        
        res.status(200).json(vehicles);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching vehicles.' });
      }
    };


          const addCar = async (req, res) => {
          try {
            const customerId = req.user.customer_id;
            const { make, model, year, vin, odometer, license_plate } = req.body;
        
            const [result] = await db.query(
              'INSERT INTO vehicles (customer_id, make, model, year, vin, odometer, license_plate) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [customerId, make, model, year, vin, odometer, license_plate]
            );
        
            res.status(201).json({ message: 'Vehicle added successfully!', car_id: result.insertId });
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error while adding vehicle.' });
          }
        };


module.exports = { getCars, addCar };
