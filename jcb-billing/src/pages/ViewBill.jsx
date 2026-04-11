// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import BillPreview from '../components/BillPreview';
// import { getBillById, getBusiness } from '../services/api';
// import { getBills, getCustomers } from '../services/api';  // Go up 1 level
// export default function ViewBill() {
//   const { id } = useParams();
//   const [bill, setBill] = useState(null);
//   const [business, setBusiness] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBillData();
//   }, [id]);

//   const fetchBillData = async () => {
//     setLoading(true);
//     try {
//       const billResponse = await getBillById(id);
//       const businessResponse = await getBusiness();
//       setBill(billResponse.data);
//       setBusiness(businessResponse.data);
//     } catch (error) {
//       console.error('Error loading bill:', error);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-xl text-gray-600">⏳ Loading bill...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!bill) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-xl text-gray-600 mb-4">❌ Bill not found</p>
//           <a href="/bills" className="text-blue-600 hover:text-blue-800 font-semibold">
//             ← Back to Bills
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <BillPreview bill={bill} customer={bill} business={business} />
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import BillPreview from '../components/BillPreview';
// import { getBillById, getBusiness } from '../services/api';

// export default function ViewBill() {
//   const { id } = useParams();
//   const [bill, setBill] = useState(null);
//   const [business, setBusiness] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBillData();
//   }, [id]);

//   const fetchBillData = async () => {
//     setLoading(true);
//     try {
//       const billResponse = await getBillById(id);
//       const businessResponse = await getBusiness();

//       console.log("Bill:", billResponse.data);

//       setBill(billResponse.data); // adjust if needed
//       setBusiness(businessResponse.data);
//     } catch (error) {
//       console.error('Error loading bill:', error);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!bill) {
//     return <p>Bill not found</p>;
//   }

//   return (
//     <div>
//       {bill && business && (
//         // <BillPreview 
//         //   bill={bill} 
//         //   customer={bill.customer} 
//         //   business={business} 
//         // />
//         <BillPreview 
//           bill={bill} 
//           customer={{
//             name: bill.customer_name,
//             phone: bill.phone,
//             address: bill.address,
//             email: bill.email
//           }}
//           business={business} 
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BillPreview from '../components/BillPreview';
import { getBillById, getBusiness, updateBill, getCustomers } from '../services/api';

export default function ViewBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [business, setBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Edit form data
  const [editData, setEditData] = useState({
    customer_id: '',
    bill_date: '',
    service_date: '',
    jcb_type: '',
    hours_worked: '',
    hourly_rate: '',
    operator_charge: '',
    fuel_charge: '',
    transport_charge: '',
    notes: '',
    payment_status: 'Pending'
  });

  useEffect(() => {
    fetchBillData();
  }, [id]);

  const fetchBillData = async () => {
    setLoading(true);
    try {
      const billResponse = await getBillById(id);
      const businessResponse = await getBusiness();
      const customersResponse = await getCustomers();

      console.log("Bill:", billResponse.data);

      setBill(billResponse.data);
      setBusiness(businessResponse.data);
      setCustomers(customersResponse.data || []);

      // Initialize edit form with bill data
      setEditData({
        customer_id: billResponse.data.customer_id || '',
        bill_date: billResponse.data.bill_date || '',
        service_date: billResponse.data.service_date || '',
        jcb_type: billResponse.data.jcb_type || '',
        hours_worked: billResponse.data.hours_worked || '',
        hourly_rate: billResponse.data.hourly_rate || '',
        operator_charge: billResponse.data.operator_charge || '0',
        fuel_charge: billResponse.data.fuel_charge || '0',
        transport_charge: billResponse.data.transport_charge || '0',
        notes: billResponse.data.notes || '',
        payment_status: billResponse.data.payment_status || 'Pending'
      });
    } catch (error) {
      console.error('Error loading bill:', error);
      setMessage('❌ Error loading bill');
    }
    setLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      // Validate required fields
      if (!editData.customer_id) {
        setMessage('❌ Customer is required');
        setIsSaving(false);
        return;
      }

      const updatePayload = {
        bill_number: bill.bill_number, // Keep original bill number
        customer_id: parseInt(editData.customer_id),
        bill_date: editData.bill_date,
        service_date: editData.service_date,
        jcb_type: editData.jcb_type,
        hours_worked: parseFloat(editData.hours_worked),
        hourly_rate: parseFloat(editData.hourly_rate),
        operator_charge: parseFloat(editData.operator_charge) || 0,
        fuel_charge: parseFloat(editData.fuel_charge) || 0,
        transport_charge: parseFloat(editData.transport_charge) || 0,
        notes: editData.notes,
        payment_status: editData.payment_status
      };

      await updateBill(id, updatePayload);
      setMessage('✅ Bill updated successfully!');
      setIsEditing(false);
      
      // Refresh bill data
      setTimeout(() => {
        fetchBillData();
      }, 1000);
    } catch (error) {
      console.error('Error updating bill:', error);
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">⏳ Loading bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Bill not found</p>
          <button
            onClick={() => navigate('/bills')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Bills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📄 Bill #{bill.bill_number}</h1>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => navigate('/bills')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-6">Edit Bill Details</h2>

            <form className="space-y-4">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Customer *</label>
                <select
                  name="customer_id"
                  value={editData.customer_id}
                  onChange={handleEditChange}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Bill Date</label>
                  <input
                    type="date"
                    name="bill_date"
                    value={editData.bill_date}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Service Date</label>
                  <input
                    type="date"
                    name="service_date"
                    value={editData.service_date}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* JCB Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">JCB Type</label>
                <input
                  type="text"
                  name="jcb_type"
                  placeholder="e.g., JCB 3DX"
                  value={editData.jcb_type}
                  onChange={handleEditChange}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hours and Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Hours Worked</label>
                  <input
                    type="number"
                    name="hours_worked"
                    step="0.5"
                    value={editData.hours_worked}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    step="0.01"
                    value={editData.hourly_rate}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Charges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Operator Charge (₹)</label>
                  <input
                    type="number"
                    name="operator_charge"
                    step="0.01"
                    value={editData.operator_charge}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Fuel Charge (₹)</label>
                  <input
                    type="number"
                    name="fuel_charge"
                    step="0.01"
                    value={editData.fuel_charge}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Transport Charge (₹)</label>
                  <input
                    type="number"
                    name="transport_charge"
                    step="0.01"
                    value={editData.transport_charge}
                    onChange={handleEditChange}
                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={editData.notes}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">Payment Status</label>
                <select
                  name="payment_status"
                  value={editData.payment_status}
                  onChange={handleEditChange}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Preview Mode */
          bill && business && (
            <BillPreview 
              bill={bill} 
              customer={{
                name: bill.customer_name,
                phone: bill.phone,
                address: bill.address,
                email: bill.email
              }}
              business={business} 
            />
          )
        )}
      </div>
    </div>
  );
}