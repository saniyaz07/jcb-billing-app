// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BillForm from '../components/BillForm';
// import { createBill } from '../services/api';
// import { getBills, getCustomers } from '../services/api';  // Go up 1 level
// export default function CreateBill() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await createBill(formData);
//       setMessage('✅ Bill created successfully!');
      
//       // Redirect to bill preview after 2 seconds
//       setTimeout(() => {
//         navigate(`/bills/${response.data.id}`);
//       }, 2000);
//     } catch (error) {
//       setMessage('❌ Error creating bill: ' + (error.response?.data?.error || error.message));
//       console.error('Error:', error);
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Create New Bill</h1>
//           <p className="text-gray-600">Fill in the details below to generate a bill for your customer</p>
//         </div>

//         {message && (
//           <div
//             className={`p-4 mb-6 rounded-lg ${
//               message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         <BillForm onSubmit={handleSubmit} loading={loading} />
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BillForm from '../components/BillForm';
// import { createBill, getCustomers, createCustomer } from '../services/api';

// export default function CreateBill() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [customers, setCustomers] = useState([]);
//   const [showAddCustomer, setShowAddCustomer] = useState(false);
//   const [customerLoading, setCustomerLoading] = useState(false);
//   const [customerMessage, setCustomerMessage] = useState('');
//   const [totalHours, setTotalHours] = useState(8);
  
//   // Daily work entries
//   const [workEntries, setWorkEntries] = useState([
//     { date: new Date().toISOString().split('T')[0], hours: 8 }
//   ]);

//   const [newCustomer, setNewCustomer] = useState({
//     name: '',
//     address: '',
//     phone: '',
//     email: '',
//   });

//   // Fetch customers on load
//   useEffect(() => {
//     const loadCustomers = async () => {
//       try {
//         const response = await getCustomers();
//         setCustomers(response.data || []);
//       } catch (error) {
//         console.error('Error loading customers:', error);
//       }
//     };
//     loadCustomers();
//   }, []);

//   // Calculate total hours whenever work entries change
//   useEffect(() => {
//     const total = workEntries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0);
//     setTotalHours(total);
//   }, [workEntries]);

//   // Add new work day
//   const addWorkDay = () => {
//     const lastDate = new Date(workEntries[workEntries.length - 1].date);
//     const nextDate = new Date(lastDate);
//     nextDate.setDate(nextDate.getDate() + 1);
    
//     setWorkEntries([
//       ...workEntries,
//       { date: nextDate.toISOString().split('T')[0], hours: 8 }
//     ]);
//   };

//   // Remove work day
//   const removeWorkDay = (index) => {
//     if (workEntries.length > 1) {
//       setWorkEntries(workEntries.filter((_, i) => i !== index));
//     }
//   };

//   // Update work day
//   const updateWorkDay = (index, field, value) => {
//     const updated = [...workEntries];
//     updated[index][field] = value;
//     setWorkEntries(updated);
//   };

//   // Add customer
//   const handleAddCustomer = async (e) => {
//     e.preventDefault();
    
//     if (!newCustomer.name.trim()) {
//       setCustomerMessage('❌ Name required');
//       return;
//     }

//     setCustomerLoading(true);

//     try {
//       const response = await createCustomer(newCustomer);
//       setCustomers([...customers, response.data]);
//       setCustomerMessage('✅ Added!');
//       setNewCustomer({ name: '', address: '', phone: '', email: '' });
      
//       setTimeout(() => {
//         setShowAddCustomer(false);
//         setCustomerMessage('');
//       }, 1500);
//     } catch (error) {
//       setCustomerMessage('❌ Error');
//       console.error(error);
//     }

//     setCustomerLoading(false);
//   };

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setNewCustomer({ ...newCustomer, [name]: value });
//   };

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const updatedData = {
//         ...formData,
//         hours_worked: totalHours,
//       };

//       const response = await createBill(updatedData);
//       setMessage('✅ Bill created!');
      
//       setTimeout(() => {
//         navigate(`/bills/${response.data.id}`);
//       }, 2000);
//     } catch (error) {
//       setMessage('❌ Error: ' + error.message);
//       console.error(error);
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Create New Bill</h1>
//           <p className="text-gray-600">Fill details to generate a bill</p>
//         </div>

//         {message && (
//           <div className={`p-4 mb-6 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {message}
//           </div>
//         )}

//         {/* Daily Work Log */}
//         <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">📅 Daily Work Log</h3>
//             <button
//               type="button"
//               onClick={addWorkDay}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
//             >
//               + Add Day
//             </button>
//           </div>

//           <div className="space-y-3 mb-4">
//             {workEntries.map((entry, index) => (
//               <div key={index} className="flex gap-3 items-end">
//                 <div className="flex-1">
//                   <label className="text-xs font-medium block mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={entry.date}
//                     onChange={(e) => updateWorkDay(index, 'date', e.target.value)}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <label className="text-xs font-medium block mb-1">Hours</label>
//                   <input
//                     type="number"
//                     value={entry.hours}
//                     onChange={(e) => updateWorkDay(index, 'hours', e.target.value)}
//                     step="0.5"
//                     min="0"
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                   />
//                 </div>

//                 {workEntries.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeWorkDay(index)}
//                     className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
//                   >
//                     🗑️
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="p-3 bg-blue-50 rounded border border-blue-200">
//             <p className="text-sm"><strong>Total Hours:</strong> <span className="text-blue-600 font-bold">{totalHours.toFixed(1)}</span> hrs</p>
//           </div>
//         </div>

//         {/* Add Customer */}
//         <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">👤 Add Customer</h3>
//             <button
//               type="button"
//               onClick={() => setShowAddCustomer(!showAddCustomer)}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
//             >
//               {showAddCustomer ? '✕ Close' : '+ Add'}
//             </button>
//           </div>

//           {customerMessage && (
//             <div className={`p-3 mb-4 rounded text-sm ${customerMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//               {customerMessage}
//             </div>
//           )}

//           {showAddCustomer && (
//             <form onSubmit={handleAddCustomer} className="space-y-3 mb-4 p-4 bg-green-50 rounded">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Customer name *"
//                 value={newCustomer.name}
//                 onChange={handleCustomerChange}
//                 className="w-full border border-gray-300 p-2 rounded text-sm"
//                 required
//               />

//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone"
//                 value={newCustomer.phone}
//                 onChange={handleCustomerChange}
//                 className="w-full border border-gray-300 p-2 rounded text-sm"
//               />

//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Address"
//                 value={newCustomer.address}
//                 onChange={handleCustomerChange}
//                 className="w-full border border-gray-300 p-2 rounded text-sm"
//               />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={newCustomer.email}
//                 onChange={handleCustomerChange}
//                 className="w-full border border-gray-300 p-2 rounded text-sm"
//               />

//               <button
//                 type="submit"
//                 disabled={customerLoading}
//                 className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
//               >
//                 {customerLoading ? 'Adding...' : 'Add Customer'}
//               </button>
//             </form>
//           )}

//           <div className="text-xs text-gray-600">
//             <p className="font-semibold mb-2">Customers: {customers.length}</p>
//           </div>
//         </div>

//         {/* Bill Form */}
//         <BillForm onSubmit={handleSubmit} loading={loading} />
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BillForm from '../components/BillForm';
import { createBill, getCustomers, createCustomer } from '../services/api';

export default function CreateBill() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [totalHours, setTotalHours] = useState(8);

  // Daily work entries
  const [workEntries, setWorkEntries] = useState([
    { date: new Date().toISOString().split('T')[0], hours: 8 }
  ]);

  // Minimal customer (ONLY name + phone)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
  });

  // Fetch customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data || []);
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };
    loadCustomers();
  }, []);

  // Calculate total hours
  useEffect(() => {
    const total = workEntries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0);
    setTotalHours(total);
  }, [workEntries]);

  // Add work day
  // const addWorkDay = () => {
  //   setWorkEntries([...workEntries, { date: '', hours: 8 }]);
  // };
const addWorkDay = () => {
  let nextDate;

  if (workEntries.length === 0) {
    // first entry → today
    nextDate = new Date();
  } else {
    // get last date and add 1 day
    const lastDate = new Date(workEntries[workEntries.length - 1].date);
    lastDate.setDate(lastDate.getDate() + 1);
    nextDate = lastDate;
  }

  const formattedDate = nextDate.toISOString().split('T')[0];

  setWorkEntries([
    ...workEntries,
    { date: formattedDate, hours: 0 }
  ]);
};


  // Remove work day
  const removeWorkDay = (index) => {
    if (workEntries.length > 1) {
      setWorkEntries(workEntries.filter((_, i) => i !== index));
    }
  };

  // Update work day
  const updateWorkDay = (index, field, value) => {
    const updated = [...workEntries];
    updated[index][field] = value;
    setWorkEntries(updated);
  };

  // Add customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (!newCustomer.name.trim()) return;

    try {
      const response = await createCustomer(newCustomer);
      setCustomers([...customers, response.data]);
      setNewCustomer({ name: '', phone: '' });
      setShowAddCustomer(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Submit bill (UNCHANGED connection)
  const handleSubmit = async (formData) => {
  // ✅ ADD THIS CHECK
  if (!formData.customer_id) {
    setMessage('❌ Please select a customer first!');
    return;
  }

  setLoading(true);
  setMessage('');

  try {
    const updatedData = {
      ...formData,
      hours_worked: totalHours,
    };

    const response = await createBill(updatedData);
    setMessage('✅ Bill created!');
    
    setTimeout(() => {
      navigate(`/bills/${response.data.id}`);
    }, 1500);

  } catch (error) {
    setMessage('❌ Error: ' + error.message);
    console.error(error);
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-6">📝 Create Bill</h1>

        {message && (
          <div className="p-3 mb-4 rounded bg-gray-200">
            {message}
          </div>
        )}

        {/* Daily Work Log */}
        <div className="bg-white p-5 rounded shadow mb-6">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">📅 Daily Work Log</h3>
            <button onClick={addWorkDay} className="bg-blue-600 text-white px-3 py-1 rounded">
              + Add Day
            </button>
          </div>

          {workEntries.map((entry, index) => (
            <div key={index} className="flex gap-3 mb-2">
              <input
                type="date"
                value={entry.date}
                onChange={(e) => updateWorkDay(index, 'date', e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                value={entry.hours}
                onChange={(e) => updateWorkDay(index, 'hours', e.target.value)}
                className="border p-2 rounded w-full"
              />
              {workEntries.length > 1 && (
                <button onClick={() => removeWorkDay(index)} className="bg-red-500 text-white px-2 rounded">
                  X
                </button>
              )}
            </div>
          ))}

          <p className="mt-2 font-semibold">Total Hours: {totalHours}</p>
        </div>

        {/* Add Customer */}
        <div className="bg-white p-5 rounded shadow mb-6">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">👤 Add Customer</h3>
            <button
              onClick={() => setShowAddCustomer(!showAddCustomer)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              {showAddCustomer ? 'Close' : '+ Add'}
            </button>
          </div>

          {showAddCustomer && (
            <form onSubmit={handleAddCustomer} className="space-y-2">
              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={handleCustomerChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={handleCustomerChange}
                className="border p-2 rounded w-full"
              />
              <button className="bg-green-600 text-white w-full py-2 rounded">
                Save Customer
              </button>
            </form>
          )}
        </div>

        {/* Bill Form */}
        {/* <BillForm onSubmit={handleSubmit} loading={loading} /> */}
            <BillForm 
      onSubmit={handleSubmit} 
      loading={loading} 
      totalHours={totalHours}
      workEntries={workEntries} 
      customers={customers}         // ✅ ADD THIS
  selectedCustomerId={null} 
    />

      </div>
    </div>
  );
}