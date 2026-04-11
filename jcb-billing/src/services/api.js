// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// export const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Business Info
// export const saveBusiness = (data) => apiClient.post('/business', data);
// export const getBusiness = () => apiClient.get('/business');

// // Bills
// export const createBill = (data) => apiClient.post('/bills', data);
// export const getBills = () => apiClient.get('/bills');
// export const getBillById = (id) => apiClient.get(`/bills/${id}`);
// export const updateBill = (id, data) => apiClient.put(`/bills/${id}`, data);
// export const deleteBill = (id) => apiClient.delete(`/bills/${id}`);

// // Customers
// export const addCustomer = (data) => apiClient.post('/customers', data);
// export const getCustomers = () => apiClient.get('/customers');
// export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);

// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // ================= BUSINESS =================
// export const saveBusiness = (data) => apiClient.post('/business', data);
// export const getBusiness = () => apiClient.get('/business');

// // ================= CUSTOMERS =================
// export const createCustomer = (data) => apiClient.post('/customers', data); // renamed
// export const getCustomers = () => apiClient.get('/customers');
// export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);

// // ================= BILLS =================
// export const createBill = (data) => apiClient.post('/bills', data);
// export const getBills = () => apiClient.get('/bills');
// export const getBillById = (id) => apiClient.get(`/bills/${id}`);
// export const updateBill = (id, data) => apiClient.put(`/bills/${id}`, data);
// export const deleteBill = (id) => apiClient.delete(`/bills/${id}`);

// export default apiClient;

// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ================= BUSINESS =================
// export const saveBusiness = (data) => apiClient.post('/business', data);
// export const getBusiness = () => apiClient.get('/business');

// // ================= CUSTOMERS =================
// export const createCustomer = (data) => apiClient.post('/customers', data);
// export const getCustomers = () => apiClient.get('/customers');
// export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);
// export const updateCustomer = (id, data) => apiClient.put(`/customers/${id}`, data);
// // ================= BILLS =================

// // 🔥 Create Bill (bill_number will be auto-generated from backend)
// export const createBill = (data) => apiClient.post('/bills', data);

// // Get all bills
// export const getBills = () => apiClient.get('/bills');

// // Get next bill number (for frontend form)
// export const getNextBillNumber = () => apiClient.get('/bills/next-number');
// // Get single bill
// export const getBillById = (id) => apiClient.get(`/bills/${id}`);

// // Update bill
// export const updateBill = (id, data) => apiClient.put(`/bills/${id}`, data);

// // Delete bill
// export const deleteBill = (id) => apiClient.delete(`/bills/${id}`);

// export default apiClient;

import axios from 'axios';

// const API_URL = 'https://jcb-billing-app.onrender.com';
const API_URL = 'https://jcb-billing-app.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= BUSINESS =================
export const saveBusiness = (data) => apiClient.post('/business', data);
export const getBusiness = () => apiClient.get('/business');

// ================= CUSTOMERS =================
// export const createCustomer = (data) => apiClient.post('/customers', data);
// export const getCustomers = () => apiClient.get('/customers');
// export const updateCustomer = (id, data) => apiClient.put(`/customers/${id}`, data); // ✅ NEW
// export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);
// ================= CUSTOMERS =================
export const createCustomer = (data) => apiClient.post('/customers', data);
export const getCustomers = () => apiClient.get('/customers');
export const updateCustomer = (id, data) => apiClient.put(`/customers/${id}`, data); // ✅ ADD THIS
export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);
// ================= BILLS =================
export const createBill = (data) => apiClient.post('/bills', data);
export const getBills = () => apiClient.get('/bills');
export const getNextBillNumber = () => apiClient.get('/bills/next-number');
export const getBillById = (id) => apiClient.get(`/bills/${id}`);
export const updateBill = (id, data) => apiClient.put(`/bills/${id}`, data);
export const deleteBill = (id) => apiClient.delete(`/bills/${id}`);

export default apiClient;