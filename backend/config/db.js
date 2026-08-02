const path = require('path');
// Step up one folder from backend/config to backend, then to project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 
// Or simpler, resolve relative to current process working directory:
// require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'DadShop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
