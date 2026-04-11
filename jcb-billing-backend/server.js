// // server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('🚀 JCB Billing Backend is running!');
});
/* ================================
   CREATE TABLES IF NOT EXISTS
================================ */
const createTables = async () => {
  // Business table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255),
        owner_name VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        gst_number VARCHAR(20),
        bank_name VARCHAR(255),
        account_number VARCHAR(255),
        ifsc_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Business table ready");
  } catch (err) {
    console.error("❌ Business table error:", err.message);
  }

  // Customers table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Customers table ready");
  } catch (err) {
    console.error("❌ Customers table error:", err.message);
  }

  // Bills table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        bill_number VARCHAR(50) UNIQUE,
        bill_date DATE,
        service_date DATE,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        jcb_type VARCHAR(100),
        hours_worked DECIMAL(10,2),
        hourly_rate DECIMAL(10,2),
        operator_charge DECIMAL(10,2) DEFAULT 0,
        fuel_charge DECIMAL(10,2) DEFAULT 0,
        transport_charge DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        subtotal DECIMAL(15,2),
        gst_amount DECIMAL(15,2),
        total_amount DECIMAL(15,2),
        payment_status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Bills table ready");
  } catch (err) {
    console.error("❌ Bills table error:", err.message);
  }
};

/* ================================
   TEST DATABASE ROUTE
================================ */
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   BUSINESS ROUTES
================================ */
app.post('/api/business', async (req, res) => {
  // const { company_name, owner_name, phone, address, gst_number, bank_name, account_number, ifsc } = req.body;
   const {
  company_name,
  owner_name,
  phone,
  address,
  gst_number,
  bank_name,
  account_number,
  ifsc_code
} = req.body;
  try {
    const result = await pool.query(
  `INSERT INTO business 
  (company_name, owner_name, phone, address, gst_number, bank_name, account_number, ifsc_code) 
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
  [
    company_name,
    owner_name,
    phone,
    address,
    gst_number,
    bank_name,
    account_number,
    ifsc_code
  ]
);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/business', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM business ORDER BY created_at DESC LIMIT 1'
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   CUSTOMER ROUTES
================================ */
// app.get('/api/customers', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT id, name, address, phone, email 
//       FROM customers 
//       ORDER BY id DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/customers', async (req, res) => {
//   const { name, address, phone, email } = req.body;
//   if (!name) return res.status(400).json({ error: "Customer name required" });

//   try {
//     const result = await pool.query(
//       `INSERT INTO customers (name, address, phone, email)
//        VALUES ($1,$2,$3,$4) RETURNING *`,
//       [name, address || '', phone || '', email || '']
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.delete('/api/customers/:id', async (req, res) => {
//   try {
//     await pool.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
//     res.json({ message: 'Customer deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

/* ================================
   UPDATE CUSTOMER (ADD THIS)
================================ */

/* ================================
   CUSTOMER ROUTES
================================ */
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, address, phone, email 
      FROM customers 
      ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, address, phone, email } = req.body;
  if (!name) return res.status(400).json({ error: "Customer name required" });

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, address, phone, email)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, address || '', phone || '', email || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE CUSTOMER - ADD THIS IF MISSING */
app.put('/api/customers/:id', async (req, res) => {
  const { name, address, phone, email } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE customers 
       SET name=$1, address=$2, phone=$3, email=$4
       WHERE id=$5 RETURNING *`,
      [name, address || '', phone || '', email || '', req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
/* ================================
   BILL ROUTES
================================ */
const calculateBillTotals = ({ hours_worked, hourly_rate, operator_charge=0, fuel_charge=0, transport_charge=0 }) => {
  const subtotal = (hours_worked * hourly_rate) + operator_charge + fuel_charge + transport_charge;
  const gst_amount = subtotal * 0.18;
  const total_amount = subtotal + gst_amount;
  return { subtotal, gst_amount, total_amount };
};

app.post('/api/bills', async (req, res) => {
  let { bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate, operator_charge=0, fuel_charge=0, transport_charge=0, notes } = req.body;

  const { subtotal, gst_amount, total_amount } = calculateBillTotals({
    hours_worked,
    hourly_rate,
    operator_charge,
    fuel_charge,
    transport_charge
  });

  try {
    // 🔥 AUTO GENERATE BILL NUMBER
    const lastBill = await pool.query(
      `SELECT bill_number FROM bills ORDER BY id DESC LIMIT 1`
    );

    let bill_number = "001";

    if (lastBill.rows.length > 0) {
      const last = parseInt(lastBill.rows[0].bill_number);
      bill_number = String(last + 1).padStart(3, '0');
    }

    const result = await pool.query(
      `INSERT INTO bills 
      (bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked,
       hourly_rate, operator_charge, fuel_charge, transport_charge, notes,
       subtotal, gst_amount, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        bill_number,
        bill_date,
        service_date,
        customer_id,
        jcb_type,
        hours_worked,
        hourly_rate,
        operator_charge,
        fuel_charge,
        transport_charge,
        notes,
        subtotal,
        gst_amount,
        total_amount
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, c.name as customer_name, c.phone, c.address, c.email
      FROM bills b
      LEFT JOIN customers c ON b.customer_id = c.id
      ORDER BY b.bill_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bills/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.name as customer_name, c.phone, c.address, c.email
       FROM bills b
       LEFT JOIN customers c ON b.customer_id = c.id
       WHERE b.id = $1`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bills/:id', async (req, res) => {
  let { bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate, operator_charge=0, fuel_charge=0, transport_charge=0, notes, payment_status } = req.body;

  const { subtotal, gst_amount, total_amount } = calculateBillTotals({ hours_worked, hourly_rate, operator_charge, fuel_charge, transport_charge });

  try {
    const result = await pool.query(
      `UPDATE bills 
       SET bill_number=$1, bill_date=$2, service_date=$3, customer_id=$4, jcb_type=$5,
           hours_worked=$6, hourly_rate=$7, operator_charge=$8, fuel_charge=$9,
           transport_charge=$10, notes=$11, subtotal=$12, gst_amount=$13,
           total_amount=$14, payment_status=$15
       WHERE id=$16 RETURNING *`,
      [bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate, operator_charge, fuel_charge, transport_charge, notes, subtotal, gst_amount, total_amount, payment_status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bills/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM bills WHERE id = $1', [req.params.id]);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Server startup failed:", err.message);
});

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import pool from './db.js';

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('🚀 JCB Billing Backend Running');
// });

// /* ================= DATABASE TEST ================= */
// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ================= CREATE TABLES ================= */
// const createTables = async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS customers (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(255),
//       address TEXT,
//       phone VARCHAR(20),
//       email VARCHAR(255),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bills (
//       id SERIAL PRIMARY KEY,
//       bill_number VARCHAR(50) UNIQUE,
//       bill_date DATE,
//       service_date DATE,
//       customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
//       jcb_type VARCHAR(100),
//       hours_worked DECIMAL(10,2),
//       hourly_rate DECIMAL(10,2),
//       operator_charge DECIMAL(10,2) DEFAULT 0,
//       fuel_charge DECIMAL(10,2) DEFAULT 0,
//       transport_charge DECIMAL(10,2) DEFAULT 0,
//       notes TEXT,
//       subtotal DECIMAL(15,2),
//       gst_amount DECIMAL(15,2),
//       total_amount DECIMAL(15,2),
//       payment_status VARCHAR(20) DEFAULT 'Pending',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   console.log("✅ Tables Ready");
// };

// /* ================= CUSTOMER ROUTES ================= */
// app.get('/api/customers', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/customers', async (req, res) => {
//   const { name, phone, email, address } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Name is required" });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO customers (name, phone, email, address)
//        VALUES ($1,$2,$3,$4) RETURNING *`,
//       [name, phone || '', email || '', address || '']
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.delete('/api/customers/:id', async (req, res) => {
//   try {
//     await pool.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
//     res.json({ message: "Customer deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ================= BILL ROUTES ================= */
// const calc = (h, r, o = 0, f = 0, t = 0) => {
//   const subtotal = (h * r) + o + f + t;
//   const gst = subtotal * 0.18;
//   return { subtotal, gst, total: subtotal + gst };
// };

// app.post('/api/bills', async (req, res) => {
//   let { bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate } = req.body;

//   const { subtotal, gst, total } = calc(hours_worked, hourly_rate);

//   try {
//     const result = await pool.query(
//       `INSERT INTO bills 
//       (bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate, subtotal, gst_amount, total_amount)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//       RETURNING *`,
//       [bill_number, bill_date, service_date, customer_id, jcb_type, hours_worked, hourly_rate, subtotal, gst, total]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/api/bills', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT b.*, c.name as customer_name
//       FROM bills b
//       LEFT JOIN customers c ON b.customer_id = c.id
//       ORDER BY b.bill_date DESC
//     `);

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Bills error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ================= START SERVER ================= */
// const PORT = process.env.PORT || 5000;

// createTables().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });