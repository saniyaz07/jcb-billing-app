import { useEffect, useState } from 'react';
import { getBusiness } from '../services/api';
import { Printer, ArrowLeft, Building2, Phone, Mail, MapPin, CheckCircle2, Clock } from 'lucide-react';

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

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const subtotal =
    parseFloat(bill.hours_worked || 0) * parseFloat(bill.hourly_rate || 0) +
    parseFloat(bill.operator_charge || 0) +
    parseFloat(bill.fuel_charge || 0) +
    parseFloat(bill.transport_charge || 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  const isPaid = (bill.payment_status || '').toLowerCase() === 'paid';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Buttons (HIDDEN IN PRINT) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* PRINT AREA START */}
      <div className="print-area bg-white p-8 md:p-10 rounded-2xl border border-slate-200/90 shadow-sm print:shadow-none print:border-0 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {bizInfo.company_name || 'JCB Services'}
            </h1>
            <div className="text-slate-600 text-xs space-y-1">
              {bizInfo.address && <p>{bizInfo.address}</p>}
              {bizInfo.phone && <p>Phone: {bizInfo.phone}</p>}
              {bizInfo.gst_number && <p>GSTIN: {bizInfo.gst_number}</p>}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-md mb-2">
              INVOICE
            </span>
            <div className="text-slate-600 text-xs space-y-1">
              <p><span className="font-semibold text-slate-800">Invoice #:</span> {bill.bill_number || '-'}</p>
              <p><span className="font-semibold text-slate-800">Date:</span> {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString('en-IN') : '-'}</p>
              <p className="flex items-center gap-1.5 justify-start sm:justify-end pt-1">
                <span className="font-semibold text-slate-800">Status:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                  <span>{bill.payment_status || 'Pending'}</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill To & Service Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200/60">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Billed To:
            </p>
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900 text-sm">{customer.name || 'Customer Name'}</p>
              {customer.address && <p>{customer.address}</p>}
              {customer.phone && <p>Phone: {customer.phone}</p>}
              {customer.email && <p>Email: {customer.email}</p>}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Service Details:
            </p>
            <div className="text-xs text-slate-700 space-y-1">
              <p><span className="font-semibold text-slate-800">JCB Model / Type:</span> {bill.jcb_type || 'JCB 3DX'}</p>
              <p><span className="font-semibold text-slate-800">Service Date:</span> {bill.service_date ? new Date(bill.service_date).toLocaleDateString('en-IN') : '-'}</p>
              <p><span className="font-semibold text-slate-800">Total Hours:</span> {bill.hours_worked || 0} hrs</p>
              <p><span className="font-semibold text-slate-800">Hourly Rate:</span> {formatCurrency(bill.hourly_rate || 0)} / hr</p>
            </div>
          </div>
        </div>

        {/* Work Log Entries */}
        {bill.work_log && bill.work_log.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Daily Work Breakdown
            </h3>
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-semibold">Date</th>
                  <th className="p-2.5 text-right font-semibold">Hours Worked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bill.work_log.map((entry, i) => (
                  <tr key={i}>
                    <td className="p-2.5 text-slate-800">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                    <td className="p-2.5 text-right font-semibold text-slate-900">{entry.hours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Charges Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 text-slate-800">
                  JCB Excavation Work ({bill.hours_worked || 0} hrs × {formatCurrency(bill.hourly_rate || 0)})
                </td>
                <td className="p-3 text-right font-bold text-slate-900">
                  {formatCurrency((bill.hours_worked || 0) * (bill.hourly_rate || 0))}
                </td>
              </tr>

              {parseFloat(bill.operator_charge || 0) > 0 && (
                <tr>
                  <td className="p-3 text-slate-800">Operator Allowance Charge</td>
                  <td className="p-3 text-right text-slate-900">{formatCurrency(bill.operator_charge)}</td>
                </tr>
              )}

              {parseFloat(bill.fuel_charge || 0) > 0 && (
                <tr>
                  <td className="p-3 text-slate-800">Fuel Surcharge</td>
                  <td className="p-3 text-right text-slate-900">{formatCurrency(bill.fuel_charge)}</td>
                </tr>
              )}

              {parseFloat(bill.transport_charge || 0) > 0 && (
                <tr>
                  <td className="p-3 text-slate-800">Transportation Charge</td>
                  <td className="p-3 text-right text-slate-900">{formatCurrency(bill.transport_charge)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST (18%)</span>
            <span className="font-semibold text-slate-800">{formatCurrency(gst)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-base font-extrabold text-slate-900">
            <span>TOTAL DUE</span>
            <span className="text-blue-700">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Notes */}
        {bill.notes && (
          <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs text-blue-900">
            <span className="font-bold block mb-1">Notes / Instructions:</span>
            <p>{bill.notes}</p>
          </div>
        )}

        {/* Bank & Payment Information */}
        <div className="border-t border-slate-200 pt-6 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
            Bank Remittance Details:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg">
            <p><span className="font-semibold text-slate-700">Bank:</span> {bizInfo.bank_name || '-'}</p>
            <p><span className="font-semibold text-slate-700">Account #:</span> {bizInfo.account_number || '-'}</p>
            <p><span className="font-semibold text-slate-700">IFSC Code:</span> {bizInfo.ifsc_code || bizInfo.ifsc || '-'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-4">
          <p className="font-medium text-slate-600 mb-1">Thank you for your business!</p>
          <p>Payment terms: Payment due within 7 days of invoice date.</p>
        </div>
      </div>
    </div>
  );
}