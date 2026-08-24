const db = require('../config/db');

const getRepairs = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const [repairs] = await db.query(
      `SELECT r.repair_id, r.service_date, r.category, r.total,
              r.payment_status, v.year_produced, v.make, v.model
       FROM repairs r
       JOIN vehicles v ON r.car_id = v.car_id
       WHERE r.customer_id = ?
       ORDER BY r.service_date DESC`,
      [customerId]
    );
    res.status(200).json(repairs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching repairs.' });
  }
};

const getRepairsByCar = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const carId = Number(req.params.carId);

    if (!Number.isInteger(carId)) {
      return res.status(400).json({ error: 'Invalid car id.' });
    }

    const [repairs] = await db.query(
      `SELECT repair_id, service_date, category, total, payment_status
       FROM repairs
       WHERE car_id = ? AND customer_id = ?
       ORDER BY service_date DESC`,
      [carId, customerId]
    );
    res.status(200).json(repairs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching repairs.' });
  }
};

const getRepairById = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const repairId = Number(req.params.id);

    if (!Number.isInteger(repairId)) {
      return res.status(400).json({ error: 'Invalid repair id.' });
    }

    const [repairs] = await db.query(
      `SELECT r.*, v.year_produced, v.make, v.model, v.license_plate, v.vin
       FROM repairs r
       JOIN vehicles v ON r.car_id = v.car_id
       WHERE r.repair_id = ? AND r.customer_id = ?`,
      [repairId, customerId]
    );

    if (repairs.length === 0) {
      return res.status(404).json({ error: 'Repair not found.' });
    }

    const [items] = await db.query(
      `SELECT item_id, description, item_type, quantity, unit_price
       FROM repair_items WHERE repair_id = ?`,
      [repairId]
    );

    res.status(200).json({ ...repairs[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching invoice.' });
  }
};

module.exports = { getRepairs, getRepairsByCar, getRepairById };
