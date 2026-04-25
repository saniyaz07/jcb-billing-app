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

  const subtotal = parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0) + parseFloat(bill.operator_charge || 0) + parseFloat(bill.fuel_charge || 0) + parseFloat(bill.transport_charge || 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="print-container">
      <div className="print:hidden mb-6 flex gap-3 sticky top-0 bg-white z-10 shadow-sm p-4">
        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"> 🖨️ Print / Save as PDF </button>
        <button onClick={() => window.history.back()} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"> ← Back </button>
      </div>
      <div className="bill-document">
        <div className="bill-header">
          <div className="header-top">
            <h1 className="company-name">{bizInfo.company_name || 'JCB Services'}</h1>
            <div className="company-details">
              <p>{bizInfo.address || 'Address not provided'}</p>
              <p>📞 {bizInfo.phone || 'Phone not provided'}</p>
              <p>GST: {bizInfo.gst_number || 'N/A'}</p>
            </div>
          </div>
          <div className="invoice-header-info">
            <h2>INVOICE</h2>
            <div className="invoice-meta">
              <div><strong>Invoice #:</strong> {bill.bill_number || '-'}</div>
              <div><strong>Date:</strong> {bill.bill_date || '-'}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span className={`status-badge ${bill.payment_status === 'Paid' ? 'paid' : 'pending'}`}> {bill.payment_status || 'Pending'} </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bill-section two-column">
          <div className="section-block">
            <h3 className="section-title">BILL TO</h3>
            <div className="section-content">
              <p className="customer-name">{customer.name || 'Customer Name'}</p>
              <p>{customer.address || '-'}</p>
              <p>📞 {customer.phone || '-'}</p>
              <p>📧 {customer.email || '-'}</p>
            </div>
          </div>
          <div className="section-block">
            <h3 className="section-title">SERVICE DETAILS</h3>
            <div className="section-content">
              <p><strong>JCB Type:</strong> {bill.jcb_type || 'N/A'}</p>
              <p><strong>Service Date:</strong> {bill.service_date || '-'}</p>
              <p><strong>Hours:</strong> {bill.hours_worked || 0} hrs</p>
              <p><strong>Rate:</strong> ₹{bill.hourly_rate || 0}/hr</p>
            </div>
          </div>
        </div>
        {bill.work_log && bill.work_log.length > 0 && (
          <div className="bill-section">
            <h3 className="section-title">📅 WORK LOG</h3>
            <table className="work-log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {bill.work_log.map((entry, i) => (
                  <tr key={i}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="text-right">{entry.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="work-log-summary">
              <p><strong>Total Days:</strong> {bill.work_log.length}</p>
              <p><strong>Total Hours:</strong> {bill.hours_worked}</p>
            </div>
          </div>
        )}
        <div className="bill-section">
          <h3 className="section-title">CHARGES</h3>
          <table className="charges-table">
            <thead>
              <tr>
                <th className="text-left">Description</th>
                <th className="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JCB Hourly Rate ({bill.hours_worked || 0} hrs × ₹{bill.hourly_rate || 0})</td>
                <td className="text-right"> {(parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0)).toFixed(2)} </td>
              </tr>
              {parseFloat(bill.operator_charge || 0) > 0 && (
                <tr>
                  <td>Operator Charge</td>
                  <td className="text-right">{parseFloat(bill.operator_charge || 0).toFixed(2)}</td>
                </tr>
              )}
              {parseFloat(bill.fuel_charge || 0) > 0 && (
                <tr>
                  <td>Fuel Charge</td>
                  <td className="text-right">{parseFloat(bill.fuel_charge || 0).toFixed(2)}</td>
                </tr>
              )}
              {parseFloat(bill.transport_charge || 0) > 0 && (
                <tr>
                  <td>Transport Charge</td>
                  <td className="text-right">{parseFloat(bill.transport_charge || 0).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bill-section totals-section">
          <div className="totals-grid">
            <div className="total-row">
              <span><strong>Subtotal:</strong></span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span><strong>GST (18%):</strong></span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="total-row total-due">
              <span><strong>TOTAL DUE:</strong></span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {bill.notes && (
          <div className="bill-section notes-section">
            <h3 className="section-title">📝 NOTES</h3>
            <p>{bill.notes}</p>
          </div>
        )}
        <div className="bill-section bank-section">
          <h3 className="section-title">💳 PAYMENT DETAILS</h3>
          <div className="bank-details">
            <p><strong>Bank:</strong> {bizInfo.bank_name || '-'}</p>
            <p><strong>Account:</strong> {bizInfo.account_number || '-'}</p>
            <p><strong>IFSC:</strong> {bizInfo.ifsc_code || '-'}</p>
          </div>
        </div>
        <div className="bill-footer">
          <p>Thank you for your business!</p>
          <p>Payment terms: Due within 7 days of invoice date</p>
          <p className="print-only">Generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
      <style>{`@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } body { margin: 0; padding: 0; background: white; } .print-container { width: 100%; margin: 0; padding: 0; } } @media screen { .print-only { display: none; } } .print-container { background: white; } .bill-document { background: white; color: #000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.4; } .bill-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 15px; border-bottom: 3px solid #000; margin-bottom: 20px; page-break-after: avoid; } .header-top { text-align: left; } .company-name { font-size: 20px; font-weight: bold; margin: 0 0 8px 0; } .company-details { font-size: 10px; line-height: 1.4; margin: 0; } .company-details p { margin: 2px 0; } .invoice-header-info { text-align: right; } .invoice-header-info h2 { font-size: 18px; margin: 0 0 10px 0; font-weight: bold; } .invoice-meta { font-size: 10px; line-height: 1.6; } .status-badge { padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 9px; } .status-badge.paid { background: #dcfce7; color: #166534; } .status-badge.pending { background: #fef3c7; color: #92400e; } .bill-section { margin-bottom: 15px; page-break-inside: avoid; } .bill-section.two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; } .section-block { page-break-inside: avoid; } .section-title { font-size: 11px; font-weight: bold; margin: 0 0 8px 0; border-bottom: 1px solid #999; padding-bottom: 3px; letter-spacing: 0.5px; } .section-content { font-size: 10px; line-height: 1.5; margin: 0; } .section-content p { margin: 3px 0; } .customer-name { font-weight: bold; font-size: 11px !important; margin-bottom: 5px !important; } .work-log-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10px; } .work-log-table thead { background: #f0f0f0; } .work-log-table th, .work-log-table td { padding: 5px 8px; border: 1px solid #ccc; text-align: left; } .work-log-table th { font-weight: bold; background: #e8e8e8; } .work-log-summary { font-size: 10px; text-align: right; padding-top: 5px; border-top: 1px solid #ddd; } .work-log-summary p { margin: 2px 0; } .charges-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; } .charges-table thead { background: #e8e8e8; } .charges-table th, .charges-table td { padding: 6px 8px; border-bottom: 1px solid #ccc; text-align: left; } .charges-table th { font-weight: bold; border-bottom: 2px solid #999; } .charges-table td:last-child, .charges-table th:last-child { text-align: right; } .totals-section { background: #f9f9f9; padding: 12px; border: 2px solid #000; margin: 15px 0; } .totals-grid { display: flex; flex-direction: column; gap: 6px; } .total-row { display: flex; justify-content: space-between; font-size: 10px; padding: 3px 0; } .total-due { border-top: 2px solid #000; padding-top: 8px; font-size: 12px; font-weight: bold; } .notes-section { background: #f0f8ff; padding: 10px; border: 1px solid #ccc; } .notes-section p { font-size: 10px; margin: 0; } .bank-section { border-top: 2px solid #999; padding-top: 10px; } .bank-details { font-size: 10px; line-height: 1.6; } .bank-details p { margin: 3px 0; } .bill-footer { text-align: center; border-top: 2px solid #999; margin-top: 20px; padding-top: 10px; font-size: 9px; page-break-inside: avoid; } .bill-footer p { margin: 4px 0; } .text-right { text-align: right; } .text-left { text-align: left; } @media print { @page { size: A4; margin: 15mm; orphans: 3; widows: 3; } * { box-shadow: none !important; text-shadow: none !important; } }`}</style>
    </div>
  );
}