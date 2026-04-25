// import { useEffect, useState } from 'react';
// import { getBusiness } from '../services/api';

// export default function BillPreview({ bill = {}, customer = {}, business }) {
//   const [bizInfo, setBizInfo] = useState(business || {});

//   useEffect(() => {
//     if (!business) fetchBusiness();
//   }, [business]);

//   const fetchBusiness = async () => {
//     try {
//       const response = await getBusiness();
//       setBizInfo(response.data || {});
//     } catch (error) {
//       console.error('Error fetching business info:', error);
//     }
//   };

//   const handlePrint = () => window.print();

//   // Safe calculations
//   const subtotal =
//     parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0) +
//     parseFloat(bill.operator_charge || 0) +
//     parseFloat(bill.fuel_charge || 0) +
//     parseFloat(bill.transport_charge || 0);

//   const gst = subtotal * 0.18;
//   const total = subtotal + gst;

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Print & Back Buttons */}
//       <div className="mb-6 flex gap-3">
//         <button
//           onClick={handlePrint}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 print:hidden"
//         >
//           🖨️ Print / Save as PDF
//         </button>
//         <button
//           onClick={() => window.history.back()}
//           className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 print:hidden"
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Bill Document */}
//       <div className="bg-white p-8 rounded-lg shadow-lg print:shadow-none print:border-0">
//         {/* Header */}
//         <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
//           <h1 className="text-4xl font-bold text-blue-700 mb-2">
//             {bizInfo.company_name || 'JCB Services'}
//           </h1>
//           <div className="text-gray-600 space-y-1">
//             <p className="text-sm">{bizInfo.address || '-'}</p>
//             <p className="text-sm">📞 {bizInfo.phone || '-'}</p>
//             <p className="text-sm">GST: {bizInfo.gst_number || 'N/A'}</p>
//           </div>
//         </div>

//         {/* Invoice Info */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
//           <div className="text-right text-sm text-gray-600">
//             <p>
//               <span className="font-semibold">Invoice #:</span> {bill.bill_number || '-'}
//             </p>
//             <p>
//               <span className="font-semibold">Date:</span> {bill.bill_date || '-'}
//             </p>
//             <p>
//               <span className="font-semibold">Status:</span>{' '}
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   bill.payment_status === 'Paid'
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-yellow-100 text-yellow-700'
//                 }`}
//               >
//                 {bill.payment_status || 'Pending'}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Bill To & Service Details */}
//         <div className="grid grid-cols-2 gap-8 mb-8">
//           <div>
//             <p className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</p>
//             <div className="text-sm text-gray-800">
//               <p className="font-bold text-lg">{customer.name || 'Customer Name'}</p>
//               <p>{customer.address || '-'}</p>
//               <p>📞 {customer.phone || '-'}</p>
//               <p>📧 {customer.email || '-'}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-gray-600 mb-2">SERVICE DETAILS:</p>
//             <div className="text-sm text-gray-800">
//               <p>
//                 <span className="font-semibold">JCB Type:</span> {bill.jcb_type || 'N/A'}
//               </p>
//               <p>
//                 <span className="font-semibold">Service Date:</span> {bill.service_date || '-'}
//               </p>
//               <p>
//                 <span className="font-semibold">Hours:</span> {bill.hours_worked || 0} hrs
//               </p>
//               <p>
//                 <span className="font-semibold">Rate:</span> ₹{bill.hourly_rate || 0}/hr
//               </p>
//             </div>
//           </div>
//         </div>
// {bill.work_log && bill.work_log.length > 0 && (
//   <div className="mb-6">
//     <h3 className="font-semibold mb-2">📅 Work Details</h3>
//     <table className="w-full border">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="p-2 text-left">Date</th>
//           <th className="p-2 text-right">Hours</th>
//         </tr>
//       </thead>
//       <tbody>
//         {bill.work_log.map((entry, i) => (
//           <tr key={i} className="border-t">
//             <td className="p-2">
//               {new Date(entry.date).toLocaleDateString()}
//             </td>
//             <td className="p-2 text-right">
//               {entry.hours}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>

//     {/* Summary */}
//     <div className="mt-2 text-right font-semibold">
//       Total Days: {bill.work_log.length} <br />
//       Total Hours: {bill.hours_worked}
//     </div>
//   </div>
// )}
//         {/* Charges Table */}
//         <div className="mb-8">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-blue-100 border-b-2 border-blue-300">
//                 <th className="text-left p-3 font-semibold text-gray-800">Description</th>
//                 <th className="text-right p-3 font-semibold text-gray-800">Amount (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="p-3 text-gray-800">
//                   JCB Hourly Rate ({bill.hours_worked || 0} hrs × ₹{bill.hourly_rate || 0})
//                 </td>
//                 <td className="text-right p-3 text-gray-800 font-semibold">
//                   {(parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0)).toFixed(2)}
//                 </td>
//               </tr>

//               {parseFloat(bill.operator_charge || 0) > 0 && (
//                 <tr className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="p-3 text-gray-800">Operator Charge</td>
//                   <td className="text-right p-3 text-gray-800 font-semibold">
//                     {parseFloat(bill.operator_charge || 0).toFixed(2)}
//                   </td>
//                 </tr>
//               )}

//               {parseFloat(bill.fuel_charge || 0) > 0 && (
//                 <tr className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="p-3 text-gray-800">Fuel Charge</td>
//                   <td className="text-right p-3 text-gray-800 font-semibold">
//                     {parseFloat(bill.fuel_charge || 0).toFixed(2)}
//                   </td>
//                 </tr>
//               )}

//               {parseFloat(bill.transport_charge || 0) > 0 && (
//                 <tr className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="p-3 text-gray-800">Transport Charge</td>
//                   <td className="text-right p-3 text-gray-800 font-semibold">
//                     {parseFloat(bill.transport_charge || 0).toFixed(2)}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Totals */}
//         <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex justify-between text-gray-700">
//               <span className="font-semibold">Subtotal:</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-gray-700">
//               <span className="font-semibold">GST (18%):</span>
//               <span>₹{gst.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="flex justify-between text-xl font-bold text-blue-700 border-t-2 border-blue-300 pt-4 mt-4">
//             <span>TOTAL DUE:</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Notes */}
//         {bill.notes && (
//           <div className="bg-blue-50 p-4 rounded-lg mb-8">
//             <p className="font-semibold text-gray-800 mb-2">📝 Notes:</p>
//             <p className="text-gray-700">{bill.notes}</p>
//           </div>
//         )}

//         {/* Bank Details */}
//         <div className="border-t-2 border-gray-300 pt-6 text-sm text-gray-600">
//           <p className="font-semibold text-gray-800 mb-3">💳 Payment Details:</p>
//           <div className="space-y-1">
//             <p>
//               <span className="font-semibold">Bank:</span> {bizInfo.bank_name || '-'}
//             </p>
//             <p>
//               <span className="font-semibold">Account:</span> {bizInfo.account_number || '-'}
//             </p>
//             <p>
//               <span className="font-semibold">IFSC:</span> {bizInfo.ifsc_code || '-'}
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-12 text-center text-xs text-gray-500 border-t pt-6">
//           <p>Thank you for your business!</p>
//           <p>Payment terms: Due within 7 days of invoice date</p>
//           <p className="mt-4 print:block hidden">Generated on {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { getBusiness } from '../services/api';

export default function BillPreview({ bill = {}, customer = {}, business }) {
  const [bizInfo, setBizInfo] = useState(business || {});

  useEffect(() => {
    if (!business) fetchBusiness();
  }, [business]);

  const fetchBusiness = async () => {
    try {
      const response = await getBusiness();
      setBizInfo(response.data || {});
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handlePrint = () => window.print();

  const subtotal =
    parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0) +
    parseFloat(bill.operator_charge || 0) +
    parseFloat(bill.fuel_charge || 0) +
    parseFloat(bill.transport_charge || 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Buttons (HIDDEN IN PRINT) */}
      <div className="mb-6 flex gap-3 no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          🖨️ Print / Save as PDF
        </button>

        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>

      {/* PRINT AREA START */}
      <div className="print-area bg-white p-8 rounded-lg shadow-lg print:shadow-none print:border-0">

        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            {bizInfo.company_name || 'JCB Services'}
          </h1>
          <div className="text-gray-600 space-y-1">
            <p className="text-sm">{bizInfo.address || '-'}</p>
            <p className="text-sm">📞 {bizInfo.phone || '-'}</p>
            <p className="text-sm">GST: {bizInfo.gst_number || 'N/A'}</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
          <div className="text-right text-sm text-gray-600">
            <p><span className="font-semibold">Invoice #:</span> {bill.bill_number || '-'}</p>
            <p><span className="font-semibold">Date:</span> {bill.bill_date || '-'}</p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                bill.payment_status === 'Paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {bill.payment_status || 'Pending'}
              </span>
            </p>
          </div>
        </div>

        {/* Bill To & Service */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</p>
            <div className="text-sm text-gray-800">
              <p className="font-bold text-lg">{customer.name || 'Customer Name'}</p>
              <p>{customer.address || '-'}</p>
              <p>📞 {customer.phone || '-'}</p>
              <p>📧 {customer.email || '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">SERVICE DETAILS:</p>
            <div className="text-sm text-gray-800">
              <p><span className="font-semibold">JCB Type:</span> {bill.jcb_type || 'N/A'}</p>
              <p><span className="font-semibold">Service Date:</span> {bill.service_date || '-'}</p>
              <p><span className="font-semibold">Hours:</span> {bill.hours_worked || 0} hrs</p>
              <p><span className="font-semibold">Rate:</span> ₹{bill.hourly_rate || 0}/hr</p>
            </div>
          </div>
        </div>

        {/* Work Log */}
        {bill.work_log && bill.work_log.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">📅 Work Details</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {bill.work_log.map((entry, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-2 text-right">{entry.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 text-right font-semibold">
              Total Days: {bill.work_log.length} <br />
              Total Hours: {bill.hours_worked}
            </div>
          </div>
        )}

        {/* Charges */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-blue-300">
                <th className="text-left p-3">Description</th>
                <th className="text-right p-3">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">
                  JCB ({bill.hours_worked || 0} hrs × ₹{bill.hourly_rate || 0})
                </td>
                <td className="text-right p-3 font-semibold">
                  {(bill.hours_worked * bill.hourly_rate || 0).toFixed(2)}
                </td>
              </tr>

              {bill.operator_charge > 0 && (
                <tr><td className="p-3">Operator</td><td className="text-right p-3">{bill.operator_charge}</td></tr>
              )}

              {bill.fuel_charge > 0 && (
                <tr><td className="p-3">Fuel</td><td className="text-right p-3">{bill.fuel_charge}</td></tr>
              )}

              {bill.transport_charge > 0 && (
                <tr><td className="p-3">Transport</td><td className="text-right p-3">{bill.transport_charge}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST: ₹{gst.toFixed(2)}</p>
          <h3 className="text-xl font-bold mt-2">TOTAL: ₹{total.toFixed(2)}</h3>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t pt-4">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
}