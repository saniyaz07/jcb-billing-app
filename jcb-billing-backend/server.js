import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('🚀 JCB Billing Backend API is running!');
});

/* ============================================================
   CREATE & ALTER TABLES IF NOT EXISTS
============================================================ */
const createTables = async () => {
  try {
    // Business Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255),
        owner_name VARCHAR(255),
        phone VARCHAR(100),
        company_tagline TEXT,
        address TEXT,
        gst_number VARCHAR(50),
        bank_name VARCHAR(255),
        account_number VARCHAR(255),
        ifsc_code VARCHAR(50),
        default_site_location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Customers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Bills Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        bill_number VARCHAR(50) UNIQUE,
        bill_date DATE,
        service_date DATE,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        site_location VARCHAR(255),
        company_name VARCHAR(255),
        company_tagline TEXT,
        company_phone VARCHAR(100),
        jcb_type VARCHAR(100),
        hours_worked DECIMAL(10,2) DEFAULT 0,
        hourly_rate DECIMAL(10,2) DEFAULT 0,
        operator_charge DECIMAL(10,2) DEFAULT 0,
        fuel_charge DECIMAL(10,2) DEFAULT 0,
        transport_charge DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        subtotal DECIMAL(15,2) DEFAULT 0,
        gst_amount DECIMAL(15,2) DEFAULT 0,
        total_amount DECIMAL(15,2) DEFAULT 0,
        payment_status VARCHAR(20) DEFAULT 'Pending',
        work_log JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Alter table to add missing columns dynamically
    const addColumnsQueries = [
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50)`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS site_location VARCHAR(255)`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS company_name VARCHAR(255)`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS company_tagline TEXT`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS company_phone VARCHAR(100)`,
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS work_log JSONB DEFAULT '[]'`,
      `ALTER TABLE business ADD COLUMN IF NOT EXISTS company_tagline TEXT`,
      `ALTER TABLE business ADD COLUMN IF NOT EXISTS default_site_location VARCHAR(255)`
    ];

    for (const q of addColumnsQueries) {
      try {
        await pool.query(q);
      } catch (err) {
        // Ignored if column already exists
      }
    }

    console.log("✅ All Database Tables Ready");
  } catch (err) {
    console.error("❌ Error initializing tables:", err);
  }
};

/* ============================================================
   TEST DB ROUTE
============================================================ */
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err) {
    console.error('❌ DB Test Connection Error:', err);
    res.status(500).json({ error: 'Database connection failure: ' + err.message });
  }
});

/* ============================================================
   BUSINESS ROUTES
============================================================ */
app.get('/api/business', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching business info:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/business', async (req, res) => {
  const {
    company_name,
    owner_name,
    phone,
    company_tagline,
    address,
    gst_number,
    bank_name,
    account_number,
    ifsc,
    ifsc_code,
    default_site_location
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO business 
       (company_name, owner_name, phone, company_tagline, address, gst_number, bank_name, account_number, ifsc_code, default_site_location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        company_name || 'A.B.S. ASHRAF SHEIKH',
        owner_name || '',
        phone || '9371775288, 9970434903',
        company_tagline || '',
        address || '',
        gst_number || '',
        bank_name || '',
        account_number || '',
        ifsc || ifsc_code || '',
        default_site_location || 'Rachana'
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving business info:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   CUSTOMER ROUTES
============================================================ */
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, phone, email, address } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Customer name is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, phone, email, address)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name.trim(), phone || '', email || '', address || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  const { name, phone, email, address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE customers 
       SET name=$1, phone=$2, email=$3, address=$4
       WHERE id=$5 RETURNING *`,
      [name, phone || '', email || '', address || '', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer record not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   BILL ROUTES WITH ROBUST VALIDATION & TRY/CATCH ERROR LOGGING
============================================================ */
app.get('/api/bills', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, 
             COALESCE(b.customer_name, c.name, 'N/A') as customer_name, 
             COALESCE(b.customer_phone, c.phone, '') as phone, 
             c.address, c.email
      FROM bills b
      LEFT JOIN customers c ON b.customer_id = c.id
      ORDER BY b.id DESC
    `);
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ error: 'Failed to retrieve bills: ' + err.message });
  }
});

app.get('/api/bills/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, 
              COALESCE(b.customer_name, c.name, 'N/A') as customer_name, 
              COALESCE(b.customer_phone, c.phone, '') as phone, 
              c.address, c.email
       FROM bills b
       LEFT JOIN customers c ON b.customer_id = c.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill invoice not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching single bill:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bills', async (req, res) => {
  try {
    let {
      bill_number,
      bill_date,
      service_date,
      customer_id,
      customer_name,
      customer_phone,
      site_location,
      company_name,
      company_tagline,
      company_phone,
      jcb_type,
      hours_worked,
      hourly_rate,
      operator_charge,
      fuel_charge,
      transport_charge,
      notes,
      subtotal,
      gst_amount,
      total_amount,
      payment_status,
      work_log
    } = req.body;

    // --- 1. Client & Field Validations ---
    if (!customer_name && !customer_id) {
      return res.status(400).json({ error: 'Customer is required.' });
    }

    // Parse and sanitize numeric inputs to prevent NaN or negative crashes
    const parsedHours = Math.max(0, parseFloat(hours_worked) || 0);
    const parsedRate = Math.max(0, parseFloat(hourly_rate) || 0);
    const parsedOperator = Math.max(0, parseFloat(operator_charge) || 0);
    const parsedFuel = Math.max(0, parseFloat(fuel_charge) || 0);
    const parsedTransport = Math.max(0, parseFloat(transport_charge) || 0);

    // Calculate totals safely
    const calculatedSubtotal = (parsedHours * parsedRate) + parsedOperator + parsedFuel + parsedTransport;
    const finalSubtotal = subtotal !== undefined ? Math.max(0, parseFloat(subtotal)) : calculatedSubtotal;
    const finalGst = gst_amount !== undefined ? Math.max(0, parseFloat(gst_amount)) : 0;
    const finalTotal = total_amount !== undefined ? Math.max(0, parseFloat(total_amount)) : (finalSubtotal + finalGst);

    if (parsedHours < 0 || parsedRate < 0 || finalTotal < 0) {
      return res.status(400).json({ error: 'Numeric bill amounts cannot be negative.' });
    }

    // Auto-generate Bill Number if missing
    if (!bill_number || !bill_number.trim()) {
      const lastBillRes = await pool.query('SELECT bill_number FROM bills ORDER BY id DESC LIMIT 1');
      if (lastBillRes.rows.length > 0 && lastBillRes.rows[0].bill_number) {
        const numPart = parseInt(lastBillRes.rows[0].bill_number.replace(/\D/g, '')) || 1000;
        bill_number = `INV-${numPart + 1}`;
      } else {
        bill_number = `INV-1001`;
      }
    }

    const sanitizedCustomerPhone = customer_phone || '';
    const sanitizedSiteLocation = site_location || 'Rachana';
    const sanitizedCompanyName = company_name || 'A.B.S. ASHRAF SHEIKH';
    const sanitizedTagline = company_tagline || 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur';
    const sanitizedCompanyPhone = company_phone || '9371775288, 9970434903';
    const sanitizedJcbType = jcb_type || 'JCB 3DX Super';
    const sanitizedNotes = notes || '';
    const sanitizedPaymentStatus = payment_status || 'Pending';
    const sanitizedWorkLog = JSON.stringify(Array.isArray(work_log) ? work_log : []);

    const result = await pool.query(
      `INSERT INTO bills 
       (bill_number, bill_date, service_date, customer_id, customer_name, customer_phone,
        site_location, company_name, company_tagline, company_phone, jcb_type,
        hours_worked, hourly_rate, operator_charge, fuel_charge, transport_charge,
        notes, subtotal, gst_amount, total_amount, payment_status, work_log)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
       RETURNING *`,
      [
        bill_number,
        bill_date || new Date(),
        service_date || new Date(),
        customer_id ? parseInt(customer_id) : null,
        customer_name || 'Jay Chand Bala Buildcon OPC Pvt. Ltd.',
        sanitizedCustomerPhone,
        sanitizedSiteLocation,
        sanitizedCompanyName,
        sanitizedTagline,
        sanitizedCompanyPhone,
        sanitizedJcbType,
        parsedHours,
        parsedRate,
        parsedOperator,
        parsedFuel,
        parsedTransport,
        sanitizedNotes,
        finalSubtotal,
        finalGst,
        finalTotal,
        sanitizedPaymentStatus,
        sanitizedWorkLog
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ ERROR CREATING BILL:', err);
    res.status(400).json({ error: 'Failed to create bill: ' + (err.detail || err.message) });
  }
});

app.put('/api/bills/:id', async (req, res) => {
  try {
    let {
      bill_number,
      bill_date,
      service_date,
      customer_id,
      customer_name,
      customer_phone,
      site_location,
      jcb_type,
      hours_worked,
      hourly_rate,
      operator_charge,
      fuel_charge,
      transport_charge,
      notes,
      subtotal,
      gst_amount,
      total_amount,
      payment_status,
      work_log
    } = req.body;

    const parsedHours = Math.max(0, parseFloat(hours_worked) || 0);
    const parsedRate = Math.max(0, parseFloat(hourly_rate) || 0);
    const parsedOperator = Math.max(0, parseFloat(operator_charge) || 0);
    const parsedFuel = Math.max(0, parseFloat(fuel_charge) || 0);
    const parsedTransport = Math.max(0, parseFloat(transport_charge) || 0);

    const calculatedSubtotal = (parsedHours * parsedRate) + parsedOperator + parsedFuel + parsedTransport;
    const finalSubtotal = subtotal !== undefined ? Math.max(0, parseFloat(subtotal)) : calculatedSubtotal;
    const finalGst = gst_amount !== undefined ? Math.max(0, parseFloat(gst_amount)) : 0;
    const finalTotal = total_amount !== undefined ? Math.max(0, parseFloat(total_amount)) : (finalSubtotal + finalGst);

    const result = await pool.query(
      `UPDATE bills 
       SET bill_number=$1, bill_date=$2, service_date=$3, customer_id=$4, customer_name=$5,
           customer_phone=$6, site_location=$7, jcb_type=$8, hours_worked=$9, hourly_rate=$10,
           operator_charge=$11, fuel_charge=$12, transport_charge=$13, notes=$14,
           subtotal=$15, gst_amount=$16, total_amount=$17, payment_status=$18, work_log=$19
       WHERE id=$20 RETURNING *`,
      [
        bill_number,
        bill_date,
        service_date,
        customer_id ? parseInt(customer_id) : null,
        customer_name || 'N/A',
        customer_phone || '',
        site_location || 'Rachana',
        jcb_type || 'JCB 3DX Super',
        parsedHours,
        parsedRate,
        parsedOperator,
        parsedFuel,
        parsedTransport,
        notes || '',
        finalSubtotal,
        finalGst,
        finalTotal,
        payment_status || 'Pending',
        JSON.stringify(Array.isArray(work_log) ? work_log : []),
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill invoice not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ ERROR UPDATING BILL:', err);
    res.status(400).json({ error: 'Failed to update bill: ' + err.message });
  }
});

app.delete('/api/bills/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM bills WHERE id = $1', [req.params.id]);
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    console.error('Error deleting bill:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   START EXPRESS SERVER
============================================================ */
const PORT = process.env.PORT || 5000;

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 JCB Billing Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Server startup error:', err);
  });