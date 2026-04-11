// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getBills, deleteBill, getCustomers } from '../services/api';// Go up 1 level
// export default function BillsList() {
//   const navigate = useNavigate();
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchBills();
//   }, []);

//   const fetchBills = async () => {
//     setLoading(true);
//     try {
//       const response = await getBills();
//       setBills(response.data);
//     } catch (error) {
//       setMessage('❌ Error loading bills');
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const handleDeleteBill = async (id) => {
//     if (window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
//       try {
//         await deleteBill(id);
//         setMessage('✅ Bill deleted successfully');
//         fetchBills();
//       } catch (error) {
//         setMessage('❌ Error deleting bill');
//         console.error(error);
//       }
//     }
//   };

//   // Filter bills
//   const filteredBills = bills.filter((bill) => {
//     const matchStatus = filterStatus === 'All' || bill.payment_status === filterStatus;
//     const matchSearch =
//       (bill.bill_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (bill.customer_name && bill.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
//     return matchStatus && matchSearch;
//   });

//   // Calculate stats
//   const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
//   const paidAmount = filteredBills
//     .filter((bill) => bill.payment_status === 'Paid')
//     .reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
//   const pendingAmount = filteredBills
//     .filter((bill) => bill.payment_status === 'Pending')
//     .reduce((sum, bill) => sum + (bill.total_amount || 0), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">📜 All Bills</h1>
//             <p className="text-gray-600">Manage and track all your invoices</p>
//           </div>
//           <button
//             onClick={() => navigate('/create-bill')}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
//           >
//             + New Bill
//           </button>
//         </div>

//         {/* Message */}
//         {message && (
//           <div
//             className={`p-4 mb-6 rounded-lg ${
//               message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-semibold mb-2">Total Bills</p>
//             <p className="text-3xl font-bold text-gray-800">{filteredBills.length}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-600 text-sm font-semibold mb-2">Total Amount</p>
//             <p className="text-3xl font-bold text-gray-800">₹{totalAmount.toFixed(0)}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-green-600 text-sm font-semibold mb-2">Paid</p>
//             <p className="text-3xl font-bold text-green-700">₹{paidAmount.toFixed(0)}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-yellow-600 text-sm font-semibold mb-2">Pending</p>
//             <p className="text-3xl font-bold text-yellow-700">₹{pendingAmount.toFixed(0)}</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Search */}
//             <div>
//               <input
//                 type="text"
//                 placeholder="🔍 Search by bill # or customer..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Status Filter */}
//             <div>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Paid">Paid</option>
//               </select>
//             </div>

//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterStatus('All');
//               }}
//               className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         {/* Bills Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {loading ? (
//             <div className="p-12 text-center">
//               <p className="text-gray-600">⏳ Loading bills...</p>
//             </div>
//           ) : filteredBills.length === 0 ? (
//             <div className="p-12 text-center">
//               <p className="text-gray-600 mb-4">
//                 {bills.length === 0
//                   ? '📭 No bills created yet. Create your first bill!'
//                   : '🔍 No bills match your search'}
//               </p>
//               {bills.length === 0 && (
//                 <button
//                   onClick={() => navigate('/create-bill')}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Create Bill
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-100 border-b-2 border-gray-300">
//                     <th className="text-left p-4 font-semibold text-gray-800">Bill #</th>
//                     <th className="text-left p-4 font-semibold text-gray-800">Customer</th>
//                     <th className="text-left p-4 font-semibold text-gray-800">JCB Type</th>
//                     <th className="text-left p-4 font-semibold text-gray-800">Date</th>
//                     <th className="text-right p-4 font-semibold text-gray-800">Amount</th>
//                     <th className="text-center p-4 font-semibold text-gray-800">Status</th>
//                     <th className="text-center p-4 font-semibold text-gray-800">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredBills.map((bill) => (
//                     <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                       <td className="p-4">
//                         <span className="font-bold text-blue-600">{bill.bill_number}</span>
//                       </td>
//                       <td className="p-4">{bill.customer_name || 'N/A'}</td>
//                       <td className="p-4 text-gray-700">{bill.jcb_type || '—'}</td>
//                       <td className="p-4 text-gray-700">{bill.bill_date}</td>
//                       <td className="p-4 text-right font-bold text-gray-800">
//                         ₹{parseFloat(bill.total_amount || 0).toFixed(2)}
//                       </td>
//                       <td className="p-4 text-center">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             bill.payment_status === 'Paid'
//                               ? 'bg-green-100 text-green-700'
//                               : 'bg-yellow-100 text-yellow-700'
//                           }`}
//                         >
//                           {bill.payment_status || 'Pending'}
//                         </span>
//                       </td>
//                       <td className="p-4 text-center space-x-2 flex justify-center">
//                         <button
//                           onClick={() => navigate(`/bills/${bill.id}`)}
//                           className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
//                           title="View bill"
//                         >
//                           👁️ View
//                         </button>
//                         <button
//                           onClick={() => handleDeleteBill(bill.id)}
//                           className="text-red-600 hover:text-red-800 font-semibold text-sm"
//                           title="Delete bill"
//                         >
//                           🗑️
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { getBills } from "../services/api";

// export default function BillsList() {
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBills();
//   }, []);

//   const fetchBills = async () => {
//     try {
//       const response = await getBills();
//       setBills(response.data || []);
//     } catch (error) {
//       console.error("Error fetching bills:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">📋 All Bills</h1>

//       {loading ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600">⏳ Loading bills...</p>
//         </div>
//       ) : bills.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 mb-4">No bills found.</p>
//           <a
//             href="/create-bill"
//             className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Create First Bill
//           </a>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="bg-gray-100 border-b-2 border-gray-300">
//                 <th className="text-left p-4 font-semibold">Invoice #</th>
//                 <th className="text-left p-4 font-semibold">Customer</th>
//                 <th className="text-left p-4 font-semibold">Date</th>
//                 <th className="text-right p-4 font-semibold">Amount</th>
//                 <th className="text-center p-4 font-semibold">Status</th>
//                 <th className="text-center p-4 font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bills.map((bill) => (
//                 <tr
//                   key={bill.id}
//                   className="border-b border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="p-4 font-semibold text-blue-600">
//                     {bill.bill_number}
//                   </td>
//                   <td className="p-4 text-gray-800">
//                     {bill.customer_name || "N/A"}
//                   </td>
//                   <td className="p-4 text-gray-600">{bill.bill_date}</td>
//                   <td className="p-4 text-right font-bold text-gray-800">
//                     ₹{parseFloat(bill.total_amount || 0).toFixed(2)}
//                   </td>
//                   <td className="p-4 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         bill.payment_status === "Paid"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {bill.payment_status || "Pending"}
//                     </span>
//                   </td>
//                   <td className="p-4 text-center">
//                     <a
//                       href={`/bills/${bill.id}`}
//                       className="text-blue-600 hover:text-blue-800 font-semibold"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { getBills, deleteBill } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function BillsList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await getBills();
      setBills(response.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setMessage('❌ Error loading bills');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      await deleteBill(id);
      setMessage('✅ Bill deleted successfully!');
      await fetchBills();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting bill:", error);
      setMessage('❌ Error deleting bill');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 All Bills</h1>
        <button
          onClick={() => navigate('/create-bill')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Create New Bill
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200 text-blue-800">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">⏳ Loading bills...</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">📭 No bills found.</p>
          <button
            onClick={() => navigate('/create-bill')}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create First Bill
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-4 font-semibold">Invoice #</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-right p-4 font-semibold">Amount</th>
                <th className="text-center p-4 font-semibold">Status</th>
                <th className="text-center p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold text-blue-600">
                    {bill.bill_number}
                  </td>
                  <td className="p-4 text-gray-800">
                    {bill.customer_name || "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(bill.bill_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-bold text-gray-800">
                    ₹{parseFloat(bill.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bill.payment_status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : bill.payment_status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {bill.payment_status || "Pending"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/bills/${bill.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-2 py-1 hover:bg-blue-50 rounded"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => navigate(`/bills/${bill.id}`)}
                        className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm px-2 py-1 hover:bg-yellow-50 rounded"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm px-2 py-1 hover:bg-red-50 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}