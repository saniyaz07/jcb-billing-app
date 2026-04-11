// import pkg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();
// const { Pool } = pkg;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
// });

// const testConnection = async () => {
//   try {
//     const client = await pool.connect();
//     console.log('✅ Connected to PostgreSQL database');
//     client.release();
//   } catch (err) {
//     console.error('❌ Database connection error:', err);
//     process.exit(1);
//   }
// };

// testConnection();
// export default pool;

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully"))
  .catch(err => console.error("❌ DB Connection Failed:", err.message));

export default pool;