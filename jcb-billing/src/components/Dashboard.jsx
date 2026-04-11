// import { useState, useEffect } from 'react';
// import { getBills, getCustomers } from "../services/api";
// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     totalBills: 0,
//     totalRevenue: 0,
//     pendingAmount: 0,
//     totalCustomers: 0,
//   });
//   const [recentBills, setRecentBills] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const billsResponse = await getBills();
//       const customersResponse = await getCustomers();

//       const bills = billsResponse.data;
//       const totalRevenue = bills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
//       const pendingAmount = bills
//         .filter((bill) => bill.payment_status === 'Pending')
//         .reduce((sum, bill) => sum + (bill.total_amount || 0), 0);

//       setStats({
//         totalBills: bills.length,
//         totalRevenue: totalRevenue,
//         pendingAmount: pendingAmount,
//         totalCustomers: customersResponse.data.length,
//       });

//       setRecentBills(bills.slice(0, 5));
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
//         <p className="text-gray-600">Welcome to your JCB Billing Management System</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Total Bills */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-blue-100 text-sm font-semibold mb-2">Total Bills</p>
//               <p className="text-4xl font-bold">{stats.totalBills}</p>
//             </div>
//             <span className="text-4xl">📄</span>
//           </div>
//           <p className="text-blue-100 text-xs mt-4">All-time invoices created</p>
//         </div>

//         {/* Total Revenue */}
//         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-green-100 text-sm font-semibold mb-2">Total Revenue</p>
//               <p className="text-3xl font-bold">
//               ₹{stats?.totalRevenue ? stats.totalRevenue.toFixed(0) : 0}</p>
//             </div>
//             <span className="text-4xl">💰</span>
//           </div>
//           <p className="text-green-100 text-xs mt-4">Total earned from bills</p>
//         </div>

//         {/* Pending Amount */}
//         <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-yellow-100 text-sm font-semibold mb-2">Pending Amount</p>
//               <p className="text-3xl font-bold">₹{stats.pendingAmount.toFixed(0)}</p>
//             </div>
//             <span className="text-4xl">⏳</span>
//           </div>
//           <p className="text-yellow-100 text-xs mt-4">Awaiting payment</p>
//         </div>

//         {/* Total Customers */}
//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-purple-100 text-sm font-semibold mb-2">Total Customers</p>
//               <p className="text-4xl font-bold">{stats.totalCustomers}</p>
//             </div>
//             <span className="text-4xl">👥</span>
//           </div>
//           <p className="text-purple-100 text-xs mt-4">Registered clients</p>
//         </div>
//       </div>

//       {/* Recent Bills Section */}
//       <div className="bg-white rounded-lg shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Recent Bills</h2>

//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-gray-600">⏳ Loading...</p>
//           </div>
//         ) : recentBills.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-600 mb-4">No bills created yet</p>
//             <a
//               href="/create-bill"
//               className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Create First Bill
//             </a>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100 border-b-2 border-gray-300">
//                   <th className="text-left p-4 font-semibold text-gray-800">Invoice #</th>
//                   <th className="text-left p-4 font-semibold text-gray-800">Customer</th>
//                   <th className="text-left p-4 font-semibold text-gray-800">Date</th>
//                   <th className="text-right p-4 font-semibold text-gray-800">Amount</th>
//                   <th className="text-center p-4 font-semibold text-gray-800">Status</th>
//                   <th className="text-center p-4 font-semibold text-gray-800">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentBills.map((bill) => (
//                   <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-4 font-semibold text-blue-600">{bill.bill_number}</td>
//                     <td className="p-4 text-gray-800">{bill.customer_name || 'N/A'}</td>
//                     <td className="p-4 text-gray-600">{bill.bill_date}</td>
//                     <td className="p-4 text-right font-bold text-gray-800">
//                       ₹{parseFloat(bill.total_amount).toFixed(2)}
//                     </td>
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           bill.payment_status === 'Paid'
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-yellow-100 text-yellow-700'
//                         }`}
//                       >
//                         {bill.payment_status || 'Pending'}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                       <a
//                         href={`/bills/${bill.id}`}
//                         className="text-blue-600 hover:text-blue-800 font-semibold"
//                       >
//                         View
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {recentBills.length > 0 && (
//           <div className="mt-6 text-center">
//             <a
//               href="/bills"
//               className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               View All Bills →
//             </a>
//           </div>
//         )}
//       </div>

//       {/* Quick Actions */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <a
//           href="/create-bill"
//           className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center"
//         >
//           <p className="text-3xl mb-2">📝</p>
//           <p className="font-semibold">Create New Bill</p>
//         </a>

//         <a
//           href="/customers"
//           className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center"
//         >
//           <p className="text-3xl mb-2">👥</p>
//           <p className="font-semibold">Manage Customers</p>
//         </a>

//         <a
//           href="/settings"
//           className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center"
//         >
//           <p className="text-3xl mb-2">⚙️</p>
//           <p className="font-semibold">Business Settings</p>
//         </a>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { getBills, getCustomers } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    totalCustomers: 0,
  });
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const billsResponse = await getBills();
      const customersResponse = await getCustomers();

      console.log("Bills:", billsResponse.data);
      console.log("Customers:", customersResponse.data);

      const bills = billsResponse.data || [];
      const customers = customersResponse.data || [];

      const totalRevenue = bills.reduce((sum, bill) => sum + (parseFloat(bill.total_amount) || 0), 0);
      const pendingAmount = bills
        .filter((bill) => bill.payment_status === 'Pending')
        .reduce((sum, bill) => sum + (parseFloat(bill.total_amount) || 0), 0);

      setStats({
        totalBills: bills.length,
        totalRevenue,
        pendingAmount,
        totalCustomers: customers.length,
      });

      setRecentBills(bills.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
        <p className="text-gray-600">Welcome to your JCB Billing Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bills */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-semibold mb-2">Total Bills</p>
              <p className="text-4xl font-bold">{stats.totalBills}</p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
          <p className="text-blue-100 text-xs mt-4">All-time invoices created</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-semibold mb-2">Total Revenue</p>
              <p className="text-3xl font-bold">
                ₹{stats.totalRevenue ? stats.totalRevenue.toFixed(0) : 0}
              </p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
          <p className="text-green-100 text-xs mt-4">Total earned from bills</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-yellow-100 text-sm font-semibold mb-2">Pending Amount</p>
              <p className="text-3xl font-bold">
                ₹{stats.pendingAmount ? stats.pendingAmount.toFixed(0) : 0}
              </p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
          <p className="text-yellow-100 text-xs mt-4">Awaiting payment</p>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-2">Total Customers</p>
              <p className="text-4xl font-bold">{stats.totalCustomers}</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
          <p className="text-purple-100 text-xs mt-4">Registered clients</p>
        </div>
      </div>

      {/* Recent Bills Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Recent Bills</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">⏳ Loading...</p>
          </div>
        ) : recentBills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No bills created yet</p>
            <a
              href="/create-bill"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create First Bill
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-4 font-semibold text-gray-800">Invoice #</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Date</th>
                  <th className="text-right p-4 font-semibold text-gray-800">Amount</th>
                  <th className="text-center p-4 font-semibold text-gray-800">Status</th>
                  <th className="text-center p-4 font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((bill) => (
                  <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-blue-600">{bill.bill_number}</td>
                    <td className="p-4 text-gray-800">{bill.customer_name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{bill.bill_date}</td>
                    <td className="p-4 text-right font-bold text-gray-800">
                      ₹{parseFloat(bill.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          bill.payment_status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {bill.payment_status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={`/bills/${bill.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {recentBills.length > 0 && (
          <div className="mt-6 text-center">
            <a
              href="/bills"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View All Bills →
            </a>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/create-bill"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center"
        >
          <p className="text-3xl mb-2">📝</p>
          <p className="font-semibold">Create New Bill</p>
        </a>

        <a
          href="/customers"
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center"
        >
          <p className="text-3xl mb-2">👥</p>
          <p className="font-semibold">Manage Customers</p>
        </a>
        <a
          href="/settings"
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center"
        ></a>
        <a
          href="/settings"
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center"
        >
          <p className="text-3xl mb-2">⚙️</p>
          <p className="font-semibold">Business Settings</p>
        </a>
      </div>
    </div>
  );
}