// import { useState, useEffect } from 'react';
// import { getCustomers } from '../services/api';

// export default function BillForm({ initialData, onSubmit, loading }) {
//   const [formData, setFormData] = useState(
//     initialData || {
//       bill_number: '',
//       bill_date: new Date().toISOString().split('T')[0],
//       service_date: new Date().toISOString().split('T')[0],
//       customer_id: '',
//       jcb_type: '3DX',
//       hours_worked: 8,
//       hourly_rate: 500,
//       operator_charge: 0,
//       fuel_charge: 0,
//       transport_charge: 0,
//       notes: '',
//     }
//   );

//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await getCustomers();
//       setCustomers(response.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'customer_id' ? parseInt(value) : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const subtotal =
//     parseFloat(formData.hours_worked || 0) * parseFloat(formData.hourly_rate || 0) +
//     parseFloat(formData.operator_charge || 0) +
//     parseFloat(formData.fuel_charge || 0) +
//     parseFloat(formData.transport_charge || 0);
//   const gst = subtotal * 0.18;
//   const total = subtotal + gst;

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
//       {/* Bill Information Section */}
//       <div className="border-b pb-6">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 Bill Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number</label>
//             <input
//               type="text"
//               name="bill_number"
//               placeholder="e.g., INV-001"
//               value={formData.bill_number}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
//             <select
//               name="customer_id"
//               value={formData.customer_id}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">-- Select Customer --</option>
//               {customers.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
//             <input
//               type="date"
//               name="bill_date"
//               value={formData.bill_date}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
//             <input
//               type="date"
//               name="service_date"
//               value={formData.service_date}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Service Details Section */}
//       <div className="border-b pb-6">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800">🚜 Service Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">JCB Type</label>
//             <input
//               type="text"
//               name="jcb_type"
//               placeholder="e.g., 3DX, 4DX, JS290"
//               value={formData.jcb_type}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
//             <input
//               type="number"
//               name="hours_worked"
//               placeholder="8"
//               value={formData.hours_worked}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               step="0.5"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
//             <input
//               type="number"
//               name="hourly_rate"
//               placeholder="500"
//               value={formData.hourly_rate}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Operator Charge (₹)</label>
//             <input
//               type="number"
//               name="operator_charge"
//               placeholder="0"
//               value={formData.operator_charge}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Charge (₹)</label>
//             <input
//               type="number"
//               name="fuel_charge"
//               placeholder="0"
//               value={formData.fuel_charge}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Transport Charge (₹)</label>
//             <input
//               type="number"
//               name="transport_charge"
//               placeholder="0"
//               value={formData.transport_charge}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Totals Section */}
//       <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">💰 Total Summary</h3>
//         <div className="space-y-2">
//           <div className="flex justify-between text-gray-700">
//             <span>JCB Work: {formData.hours_worked} hrs × ₹{formData.hourly_rate}</span>
//             <span className="font-semibold">₹{(formData.hours_worked * formData.hourly_rate).toFixed(2)}</span>
//           </div>
//           {parseFloat(formData.operator_charge) > 0 && (
//             <div className="flex justify-between text-gray-700">
//               <span>Operator Charge</span>
//               <span className="font-semibold">₹{parseFloat(formData.operator_charge).toFixed(2)}</span>
//             </div>
//           )}
//           {parseFloat(formData.fuel_charge) > 0 && (
//             <div className="flex justify-between text-gray-700">
//               <span>Fuel Charge</span>
//               <span className="font-semibold">₹{parseFloat(formData.fuel_charge).toFixed(2)}</span>
//             </div>
//           )}
//           {parseFloat(formData.transport_charge) > 0 && (
//             <div className="flex justify-between text-gray-700">
//               <span>Transport Charge</span>
//               <span className="font-semibold">₹{parseFloat(formData.transport_charge).toFixed(2)}</span>
//             </div>
//           )}
//           <div className="border-t border-blue-300 my-3 pt-3 flex justify-between text-gray-700">
//             <span>Subtotal</span>
//             <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-gray-700">
//             <span>GST (18%)</span>
//             <span className="font-semibold">₹{gst.toFixed(2)}</span>
//           </div>
//           <div className="border-t-2 border-blue-400 pt-3 flex justify-between text-xl font-bold text-blue-700">
//             <span>Total Due</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Notes Section */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">📋 Notes</label>
//         <textarea
//           name="notes"
//           placeholder="e.g., Site excavation for foundation, Soil removal, etc."
//           value={formData.notes}
//           onChange={handleChange}
//           className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           rows="4"
//         ></textarea>
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? '⏳ Creating...' : '✅ Create Bill'}
//       </button>
      
//     </form>
//   );
// }
import { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '../services/api';

export default function BillForm({ initialData, onSubmit, loading , totalHours}) {
// export default function BillForm({ onSubmit, loading, totalHours }) {
  const [formData, setFormData] = useState(
    initialData || {
      // bill_number: '',
      bill_date: new Date().toISOString().split('T')[0],
      service_date: new Date().toISOString().split('T')[0],
      customer_id: '',
      jcb_type: '3DX',
      hours_worked: totalHours,
      hourly_rate: 1000,
      operator_charge: 0,
      fuel_charge: 0,
      transport_charge: 0,
      // notes: '',
    }
  );
useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    hours_worked: totalHours,
  }));
}, [totalHours]);
  // Customer states
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [customerMessage, setCustomerMessage] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(formData.customer_id);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      setCustomerMessage('❌ Error fetching customers');
      console.error(err);
    }
    setLoadingCustomers(false);
  };

  const handleCustomerSelect = (customer) => {
    if (!customer || !customer.id) return;
    setSelectedCustomerId(customer.id);
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.id,
    }));
  };

  const handleCustomerAdd = async (e) => {
    e.preventDefault();
    if (!customerForm.name) return setCustomerMessage('❌ Name required');

    try {
      const res = await createCustomer(customerForm);
      const newCustomer = res?.data || res;

      if (!newCustomer || !newCustomer.id) throw new Error("Invalid customer response");

      setCustomerMessage('✅ Customer added!');
      setCustomerForm({ name: '', phone: '', email: '', address: '' });
      setShowForm(false);
      await fetchCustomers();
      handleCustomerSelect(newCustomer); // auto-select newly added customer
    } catch (err) {
      console.error(err);
      setCustomerMessage('❌ Error adding customer');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'customer_id' ? parseInt(value) : value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  // };
const handleSubmit = (e) => {
  e.preventDefault();

  // ✅ Check if customer is selected
  if (!formData.customer_id) {
    setCustomerMessage('❌ Please select a customer first!');
    return;
  }

  // ✅ Just submit the formData (hours_worked is already set)
  onSubmit(formData);
};

  const subtotal =
    parseFloat(formData.hours_worked || 0) * parseFloat(formData.hourly_rate || 0) +
    parseFloat(formData.operator_charge || 0) +
    parseFloat(formData.fuel_charge || 0) +
    parseFloat(formData.transport_charge || 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
      {/* Bill Information */}
      <div className="border-b pb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 Bill Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number</label>
            <input
              // type="text"
              // name="bill_number"
              // placeholder="e.g., INV-001"
              // value={formData.bill_number}
              // onChange={handleChange}
              // className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              // required
              name="bill_number"
              value={formData.bill_number}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <div className="max-h-40 overflow-y-auto border rounded mb-2">
              {loadingCustomers ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : (
                filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleCustomerSelect(c)}
                    className={`p-2 cursor-pointer border-b last:border-b-0 ${
                      selectedCustomerId === c.id ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                  >
                    {c.name} {c.phone && `📞 ${c.phone}`}
                  </div>
                ))
              )}
              <div
                onClick={() => setShowForm(true)}
                className="p-2 text-gray-500 text-center cursor-pointer border-t border-dashed"
              >
                ➕ Add New Customer
              </div>
            </div>

            {/* Inline Add Customer Form */}
            {showForm && (
              <div className="p-2 border rounded space-y-2 mb-2">
                {customerMessage && (
                  <div className="text-sm p-1 bg-gray-100 rounded">{customerMessage}</div>
                )}
                <input
                  type="text"
                  placeholder="Name *"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={handleCustomerAdd}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Add Customer
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
            <input
              type="date"
              name="bill_date"
              value={formData.bill_date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
            <input
              type="date"
              name="service_date"
              value={formData.service_date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="border-b pb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🚜 Service Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JCB Type</label>
            <input
              type="text"
              name="jcb_type"
              placeholder="e.g., 3DX, 4DX, JS290"
              value={formData.jcb_type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
            <input
              // type="number"
              // name="hours_worked"
              // placeholder="8"
              // value={formData.hours_worked}
              // onChange={handleChange}
              // className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              // step="0.5"
              // min="0"
      
            type="number"
            name="hours_worked"
            value={formData.hours_worked}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"


      
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
            <input
              type="number"
              name="hourly_rate"
              placeholder="500"
              value={formData.hourly_rate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operator Charge (₹)</label>
            <input
              type="number"
              name="operator_charge"
              placeholder="0"
              value={formData.operator_charge}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Charge (₹)</label>
            <input
              type="number"
              name="fuel_charge"
              placeholder="0"
              value={formData.fuel_charge}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Charge (₹)</label>
            <input
              type="number"
              name="transport_charge"
              placeholder="0"
              value={formData.transport_charge}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">💰 Total Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>JCB Work: {formData.hours_worked} hrs × ₹{formData.hourly_rate}</span>
            <span className="font-semibold">₹{(formData.hours_worked * formData.hourly_rate).toFixed(2)}</span>
          </div>
          {parseFloat(formData.operator_charge) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Operator Charge</span>
              <span className="font-semibold">₹{parseFloat(formData.operator_charge).toFixed(2)}</span>
            </div>
          )}
          {parseFloat(formData.fuel_charge) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Fuel Charge</span>
              <span className="font-semibold">₹{parseFloat(formData.fuel_charge).toFixed(2)}</span>
            </div>
          )}
          {parseFloat(formData.transport_charge) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Transport Charge</span>
              <span className="font-semibold">₹{parseFloat(formData.transport_charge).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-blue-300 my-3 pt-3 flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>GST (18%)</span>
            <span className="font-semibold">₹{gst.toFixed(2)}</span>
          </div>
          <div className="border-t-2 border-blue-400 pt-3 flex justify-between text-xl font-bold text-blue-700">
            <span>Total Due</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">📋 Notes</label>
        <textarea
          name="notes"
          placeholder="e.g., Site excavation for foundation, Soil removal, etc."
          value={formData.notes}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Creating...' : '✅ Create Bill'}
      </button>
    </form>
  );
}