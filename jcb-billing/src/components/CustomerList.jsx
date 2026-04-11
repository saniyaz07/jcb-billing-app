// import { useState, useEffect } from 'react';
// import { getCustomers, createCustomer } from '../services/api';

// export default function CustomerList({ onCustomerSelect }) {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
//   const [message, setMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const response = await getCustomers();
//       setCustomers(response.data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error fetching customers');
//     }
//     setLoading(false);
//   };

//   const handleSelectCustomer = (customer) => {
//     setSelectedCustomer(customer?.id || null);
//     onCustomerSelect(customer || null);
//     if (!customer) setShowForm(true);
//   };

//   const handleAddCustomer = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) return setMessage('❌ Customer name is required');

//     try {
//       const res = await createCustomer(formData);
//       const newCustomer = res.data;
//       setMessage('✅ Customer added!');
//       setFormData({ name: '', address: '', phone: '', email: '' });
//       setShowForm(false);
//       await fetchCustomers();
//       // Auto-select the new customer
//       handleSelectCustomer(newCustomer);
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error adding customer');
//     }
//   };

//   const filteredCustomers = customers.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.phone && c.phone.includes(searchTerm)) ||
//       (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {message && (
//         <div
//           className={`p-2 mb-4 rounded ${
//             message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="🔍 Search customers..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       {/* Customers list */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
//         {filteredCustomers.map((customer) => (
//           <div
//             key={customer.id}
//             onClick={() => handleSelectCustomer(customer)}
//             className={`cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 ${
//               selectedCustomer === customer.id ? 'border-blue-600' : 'border-gray-200'
//             }`}
//           >
//             <h3 className="text-lg font-semibold">{customer.name}</h3>
//             {customer.phone && <p>📞 {customer.phone}</p>}
//             {customer.email && <p>📧 {customer.email}</p>}
//             {customer.address && <p>🏠 {customer.address}</p>}
//           </div>
//         ))}

//         {/* Add New Customer card */}
//         <div
//           onClick={() => handleSelectCustomer(null)}
//           className="cursor-pointer flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg border-dashed border-2 border-gray-300 text-gray-600 font-semibold"
//         >
//           ➕ Add New Customer
//         </div>
//       </div>

//       {/* Add New Customer Form */}
//       {showForm && (
//         <form onSubmit={handleAddCustomer} className="bg-white p-6 rounded-lg shadow mt-6 space-y-4">
//           <h3 className="text-xl font-semibold mb-2">Add New Customer</h3>
//           <input
//             type="text"
//             name="name"
//             placeholder="Customer Name *"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
//           >
//             ✅ Add Customer
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { getCustomers, addCustomer } from '../services/api';

// export default function CustomerSelector({ onCustomerSelect }) {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
//   const [message, setMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const res = await getCustomers();
//       setCustomers(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error fetching customers');
//     }
//     setLoading(false);
//   };

//   const handleSelectChange = (e) => {
//     const id = e.target.value;
//     if (id === 'new') {
//       setShowForm(true);
//       setSelectedCustomer('');
//       onCustomerSelect(null);
//     } else {
//       const customer = customers.find((c) => c.id.toString() === id);
//       setSelectedCustomer(id);
//       onCustomerSelect(customer);
//       setShowForm(false);
//     }
//   };

//   const handleAddCustomer = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) return setMessage('❌ Customer name is required');

//     try {
//       const res = await addCustomer(formData);
//       const newCustomer = res.data;

//       setMessage('✅ Customer added!');
//       setFormData({ name: '', address: '', phone: '', email: '' });
//       setShowForm(false);
//       await fetchCustomers(); // reload the list
//       setSelectedCustomer(newCustomer.id); // select new customer
//       onCustomerSelect(newCustomer);
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error adding customer');
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4">
//       {message && (
//         <div className={`p-2 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//           {message}
//         </div>
//       )}

//       <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
//       <select value={selectedCustomer} onChange={handleSelectChange} className="w-full border p-2 rounded mb-4">
//         <option value="" disabled>
//           🔍 Select a customer
//         </option>
//         {customers.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.name} {c.phone ? `(${c.phone})` : ''}
//           </option>
//         ))}
//         <option value="new">➕ Add New Customer</option>
//       </select>

//       {showForm && (
//         <form onSubmit={handleAddCustomer} className="bg-white p-4 rounded shadow space-y-3">
//           <input type="text" placeholder="Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full border p-2 rounded"/>
//           <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-2 rounded"/>
//           <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border p-2 rounded"/>
//           <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border p-2 rounded"/>
//           <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">✅ Add Customer</button>
//         </form>
//       )}
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';

// // --- 1. MOCK API (Temporary Fix: Replaces '../services/api') ---
// // This simulates your backend so the list populates immediately.
// // DELETE THIS BLOCK when you connect your real backend.
// const getCustomers = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: [
//           { id: 1, name: 'Alice Johnson', phone: '555-0123', email: 'alice@example.com', address: '123 Maple St' },
//           { id: 2, name: 'Bob Smith', phone: '555-9876', email: 'bob@company.com', address: '456 Oak Ave' },
//           { id: 3, name: 'Charlie Brown', phone: '555-5555', email: 'charlie@peanuts.com', address: '' }
//         ]
//       });
//     }, 500); // Simulate network delay
//   });
// };

// const createCustomer = (customerData) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: { ...customerData, id: Date.now() } // Simulate backend assigning an ID
//       });
//     }, 500);
//   });
// };
// // ---------------------------------------------------------------

// export default function CustomerList({ onCustomerSelect }) {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
//   const [message, setMessage] = useState('');
//   const [selectedId, setSelectedId] = useState(null);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const res = await getCustomers();
//       // Fix: Safely set customers, default to empty array if data is missing
//       setCustomers(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error fetching customers');
//     }
//     setLoading(false);
//   };

//   const handleSelect = (customer) => {
//     setSelectedId(customer.id);
//     // Fix: Safety check in case parent component didn't pass the prop
//     if (onCustomerSelect) {
//       onCustomerSelect(customer);
//     }
//     setShowForm(false); // Close form if we select an existing customer
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     if (!formData.name) return setMessage('❌ Name required');

//     try {
//       const res = await createCustomer(formData);
//       setMessage('✅ Customer added!');
//       setFormData({ name: '', phone: '', email: '', address: '' });
//       setShowForm(false);
//       await fetchCustomers();
//       handleSelect(res.data); // Auto-select the new customer
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Error adding customer');
//     }
//   };

//   // Fix: Ensure customers is an array before filtering to prevent crashes
//   const filtered = (customers || []).filter(c =>
//     c.name.toLowerCase().includes(search.toLowerCase()) ||
//     (c.phone && c.phone.includes(search))
//   );

//   return (
//     <div className="p-4 bg-white rounded shadow">
//       {message && <div className="mb-2 p-2 bg-gray-100 rounded border border-gray-200">{message}</div>}

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search customers..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       {/* Loading Indicator */}
//       {loading && <div className="text-center text-gray-500 mb-4">Loading customers...</div>}

//       {/* Customer List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
//         {!loading && filtered.map(c => (
//           <div
//             key={c.id}
//             onClick={() => handleSelect(c)}
//             className={`p-3 border rounded cursor-pointer transition-colors ${
//               selectedId === c.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
//             }`}
//           >
//             <strong>{c.name}</strong> <br />
//             {c.phone && <span className="text-sm text-gray-600">📞 {c.phone}</span>} <br />
//             {c.email && <span className="text-sm text-gray-600">📧 {c.email}</span>}
//           </div>
//         ))}

//         {/* Add New Customer Button */}
//         {!loading && (
//           <div
//             onClick={() => {
//               // Fix: Clear previous form data and selection when clicking "Add New"
//               setFormData({ name: '', phone: '', email: '', address: '' });
//               setShowForm(true);
//               setSelectedId(null);
//             }}
//             className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded cursor-pointer text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
//           >
//             ➕ Add New Customer
//           </div>
//         )}
//       </div>

//       {/* Add New Customer Form */}
//       {showForm && (
//         <form onSubmit={handleAdd} className="mt-4 space-y-2 p-3 border rounded shadow-sm bg-gray-50">
//           <h4 className="font-semibold text-gray-700 mb-2">Enter New Customer Details</h4>
//           <input
//             type="text"
//             placeholder="Name *"
//             value={formData.name}
//             onChange={e => setFormData({ ...formData, name: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Phone"
//             value={formData.phone}
//             onChange={e => setFormData({ ...formData, phone: e.target.value })}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={e => setFormData({ ...formData, email: e.target.value })}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             value={formData.address}
//             onChange={e => setFormData({ ...formData, address: e.target.value })}
//             className="w-full border p-2 rounded"
//           />
//           <div className="flex gap-2 pt-2">
//             <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
//               Cancel
//             </button>
//             <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
//               Add Customer
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';

export default function CustomerList({ onCustomerSelect }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Fetch customers on mount and refresh every 3 seconds
  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCustomers(data);
    } catch (err) {
      console.error('❌ Error fetching customers:', err);
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  const handleSelect = (customer) => {
    setSelectedId(customer.id);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || ''
    });
    setShowForm(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setMessage('❌ Name required');

    try {
      if (editingId) {
        // UPDATE existing customer
        await updateCustomer(editingId, formData);
        setMessage('✅ Customer updated successfully!');
        setEditingId(null);
      } else {
        // CREATE new customer
        const res = await createCustomer(formData);
        setMessage('✅ Customer added successfully!');
        handleSelect(res.data);
      }

      setFormData({ name: '', phone: '', email: '', address: '' });
      setShowForm(false);
      await fetchCustomers(); // Refresh list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error:', err);
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(id);
      setMessage('✅ Customer deleted!');
      await fetchCustomers();
      if (selectedId === id) setSelectedId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting:', err);
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const filtered = (customers || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      {message && (
        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200 text-blue-800 text-sm">
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Search customers by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <div className="text-center text-gray-500 mb-4">⏳ Loading customers...</div>}

      {!loading && customers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-3">📭 No customers yet</p>
          <button
            onClick={() => {
              setFormData({ name: '', phone: '', email: '', address: '' });
              setShowForm(true);
              setEditingId(null);
              setSelectedId(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add First Customer
          </button>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto mb-4 pb-2">
          {filtered.length > 0 ? (
            filtered.map(c => (
              <div
                key={c.id}
                className={`p-3 border rounded transition-colors ${
                  selectedId === c.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div onClick={() => handleSelect(c)} className="cursor-pointer mb-2">
                  <strong className="text-lg block mb-1">{c.name}</strong>
                  {c.phone && <span className="text-sm text-gray-600 block">📞 {c.phone}</span>}
                  {c.email && <span className="text-sm text-gray-600 block">📧 {c.email}</span>}
                  {c.address && <span className="text-sm text-gray-600 block">📍 {c.address}</span>}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No customers match "{search}"
            </div>
          )}

          {/* Add New Customer Button */}
          <div
            onClick={() => {
              setFormData({ name: '', phone: '', email: '', address: '' });
              setShowForm(true);
              setEditingId(null);
              setSelectedId(null);
            }}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded cursor-pointer text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            ➕ Add New Customer
          </div>
        </div>
      )}

      {/* Add/Edit Customer Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 p-4 border rounded shadow-sm bg-gray-50">
          <h4 className="font-semibold text-gray-700 mb-3">
            {editingId ? '✏️ Edit Customer' : '➕ Add New Customer'}
          </h4>
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', phone: '', email: '', address: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition"
            >
              {editingId ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}