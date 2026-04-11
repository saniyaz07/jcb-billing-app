-- Business Info Table
CREATE TABLE business (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  gst_number VARCHAR(20),
  bank_name VARCHAR(255),
  account_number VARCHAR(255),
  ifsc_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bills Table
CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  bill_number VARCHAR(50) NOT NULL UNIQUE,
  bill_date DATE NOT NULL,
  service_date DATE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
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


-- Indexes for faster queries
CREATE INDEX idx_bills_customer ON bills(customer_id);
CREATE INDEX idx_bills_date ON bills(bill_date);


