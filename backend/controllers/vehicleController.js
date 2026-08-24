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
      'INSERT INTO vehicles (customer_id, make, model, year_produced, vin, odometer, license_plate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customerId, make, model, year, vin, odometer, license_plate]
    );

    res.status(201).json({ message: 'Vehicle added successfully!', car_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding vehicle.' });
  }
};

const updateCar = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const carId = Number(req.params.id);

    if (!Number.isInteger(carId)) {
      return res.status(400).json({ error: 'Invalid car id.' });
    }

    const { make, model, year, vin, odometer, license_plate } = req.body;

    if (!make || !model || !year) {
      return res.status(400).json({ error: 'Make, model, and year are required.' });
    }

    const cleanVin = vin ? String(vin).toUpperCase().trim() : null;
    if (cleanVin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
      return res.status(400).json({ error: 'VIN must be 17 characters and cannot contain I, O, or Q.' });
    }

    const [result] = await db.query(
      `UPDATE vehicles
       SET make = ?, model = ?, year_produced = ?, vin = ?, odometer = ?, license_plate = ?
       WHERE car_id = ? AND customer_id = ?`,
      [
        make.toUpperCase().trim(),
        model.toUpperCase().trim(),
        year,
        cleanVin,
        odometer || null,
        license_plate ? license_plate.toUpperCase().trim() : null,
        carId,
        customerId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json({ message: 'Vehicle updated successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That VIN is already registered.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error while updating vehicle.' });
  }
};


module.exports = { getCars, addCar ,updateCar };
