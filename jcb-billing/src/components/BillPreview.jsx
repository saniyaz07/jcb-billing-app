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
      <style>{`@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } body { margin: 0; padding: 0; background: white; } .print-container { width: 100%; margin: 0; padding: 0; } } @media screen { .print-only { display: none; } } .print-container { background: white; } .bill-document { background: white; color: #000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.4; } .bill-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 15px; border-bottom: 3px solid #000; margin-bottom: 20px; page-break-after: avoid; } .header-top { text-align: left; } .company-name { font-size: 20px; font-weight: bold; margin: 0 0 8px 0; } .company-details { font-size: 10px; line-height: 1.4; margin: 0; } .company-details p { margin: 2px 0; } .invoice-header-info { text-align: right; } .invoice-header-info h2 { font-size: 18px; margin: 0 0 10px 0; font-weight: bold; } .invoice-meta { font-size: 10px; line-height: 1.6; } .status-badge { padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 9px; } .status-badge.paid { background: #dcfce7; color: #166534; } .status-badge.pending { background: #fef3c7; color: #92400e; } .bill-section { margin-bottom: 15px; page-break-inside: avoid; } .bill-section.two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; } .section-block { page-break-inside: avoid; } .section-title { font-size: 11px; font-weight: bold; margin: 0 0 8px 0; border-bottom: 1px solid #999; padding-bottom: 3px; letter-spacing: 0.5px; } .section-content { font-size: 10px; line-height: 1.5; margin: 0; } .section-content p { margin: 3px 0; } .customer-name { font-weight: bold; font-size: 11px !important; margin-bottom: 5px !important; } .work-log-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10px; } .work-log-table thead { background: #f0f0f0; } .work-log-table th, .work-log-table td { padding: 5px 8px; border: 1px solid #ccc; text-align: left; } .work-log-table th { font-weight: bold; background: #e8e8e8; } .work-log-summary { font-size: 10px; text-align: right; padding-top: 5px; border-top: 1px solid #ddd; } .work-log-summary p { margin: 2px 0; } .charges-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; } .charges-table thead { background: #e8e8e8; } .charges-table th, .charges-table td { padding: 6px 8px; border-bottom: 1px solid #ccc; text-align: left; } .charges-table th { font-weight: bold; border-bottom: 2px solid #999; } .charges-table td:last-child, .charges-table th:last-child { text-align: right; } .totals-section { background: #f9f9f9; padding: 12px; border: 2px solid #000; margin: 15px 0; } .totals-grid { display: flex; flex-direction: column; gap: 6px; } .total-row { display: flex; justify-content: space-between; font-size: 10px; padding: 3px 0; } .total-due { border-top: 2px solid #000; padding-top: 8px; font-size: 12px; font-weight: bold; } .notes-section { background: #f0f8ff; padding: 10px; border: 1px solid #ccc; } .notes-section p { font-size: 10px; margin: 0; } .bank-section { border-top: 2px solid #999; padding-top: 10px; } .bank-details { font-size: 10px; line-height: 1.6; } .bank-details p { margin: 3px 0; } .bill-footer { text-align: center; border-top: 2px solid #999; margin-top: 20px; padding-top: 10px; font-size: 9px; page-break-inside: avoid; } .bill-footer p { margin: 4px 0; } .text-right { text-align: right; } .text-left { text-align: left; } @media print { @page { size: A4; margin: 15mm; orphans: 3; widows: 3; } * { box-shadow: none !important; text-shadow: none !important; } }`}</style>
    </div>
  );
}