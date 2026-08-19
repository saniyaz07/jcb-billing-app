import { useEffect, useState } from 'react';
import { getBusiness } from '../services/api';
import { numberToWords } from '../utils/numberToWords';
import { Printer, ArrowLeft } from 'lucide-react';

export default function BillPreview({ bill = {}, customer = {}, business }) {
  const [bizInfo, setBizInfo] = useState(business || {});

  useEffect(() => {
    if (!business) fetchBusiness();
  }, [business]);

  const fetchBusiness = async () => {
    try {
      const response = await getBusiness();
      if (response?.data) {
        setBizInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handlePrint = () => window.print();

  // Sensible default fallbacks
  const companyName = bill.company_name || bizInfo.company_name || 'A.B.S. ASHRAF SHEIKH';
  const companyTagline = bill.company_tagline || bizInfo.company_tagline || 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur';
  const companyPhone = bill.company_phone || bizInfo.phone || '9371775288, 9970434903';
  const siteLocation = bill.site_location || 'Rachana';
  const clientName = bill.customer_name || customer.name || 'Jay Chand Bala Buildcon OPC Pvt. Ltd.';
  const clientMobile = bill.customer_phone || customer.phone || '9876543210';
  const billNumber = bill.bill_number || 'INV-1001';
  const billDate = bill.bill_date ? new Date(bill.bill_date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const jcbType = bill.jcb_type || 'JCB 3DX Super';

  // Numeric calculations
  const hoursWorked = parseFloat(bill.hours_worked || 0);
  const hourlyRate = parseFloat(bill.hourly_rate || 0);
  const jcbAmount = hoursWorked * hourlyRate;

  // Work Log array for 3-column compact grid display inside Particulars cell
  const workLog = bill.work_log || [];

  // Per-Day Operator Bhatta Calculations
  const operatorBhattaDays = bill.operator_bhatta_days || (workLog && workLog.length > 0 ? workLog.length : 1);
  const operatorBhattaRate = bill.operator_bhatta_rate_per_day !== undefined ? parseFloat(bill.operator_bhatta_rate_per_day) : 200;
  const operatorCharge = bill.operator_charge !== undefined ? parseFloat(bill.operator_charge) : (operatorBhattaDays * operatorBhattaRate);

  const fuelCharge = parseFloat(bill.fuel_charge || 0);
  const transportCharge = parseFloat(bill.transport_charge || 0);

  const subtotal = bill.subtotal !== undefined ? parseFloat(bill.subtotal) : (jcbAmount + operatorCharge + fuelCharge + transportCharge);
  const gstAmount = bill.gst_amount !== undefined ? parseFloat(bill.gst_amount) : (bill.include_gst ? subtotal * 0.18 : 0);
  const grandTotal = bill.total_amount !== undefined ? parseFloat(bill.total_amount) : (subtotal + gstAmount);

  const rupeesInWords = numberToWords(grandTotal);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(val) || 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Action Bar (STRICTLY HIDDEN IN PRINT PREVIEW TO PREVENT HEADER LEAKS) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF (Single-Page A4)
        </button>
      </div>

      {/* SINGLE-PAGE A4 PRINTABLE INVOICE TEMPLATE */}
      <div className="print-area bg-white p-6 md:p-8 border border-slate-900 shadow-md print:shadow-none print:border-0 font-sans text-slate-900 leading-tight text-[11px]">
        {/* Header - Clean 2-Column Layout */}
        <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-900 pb-3 mb-3">
          {/* Left Column: Business Name, Tagline, Address, Contact */}
          <div className="col-span-8 space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
              {companyName}
            </h1>
            <p className="text-[10px] font-semibold text-slate-700 leading-snug">
              {companyTagline}
            </p>
            <p className="text-[10px] font-bold text-slate-900 pt-0.5">
              Contact / Mob: <span className="font-semibold text-slate-800">{companyPhone}</span>
            </p>
          </div>

          {/* Right Column: Invoice Metadata & Jurisdiction */}
          <div className="col-span-4 text-right flex flex-col justify-between items-end">
            <div className="bg-slate-900 text-white px-3 py-1 font-black text-xs uppercase tracking-wider rounded-sm mb-1">
              INVOICE / BILL
            </div>
            <div className="text-[10px] space-y-0.5 font-medium text-slate-800">
              <p><span className="font-bold text-slate-900">Invoice No:</span> {billNumber}</p>
              <p><span className="font-bold text-slate-900">Date:</span> {billDate}</p>
              <p><span className="font-bold text-slate-900">Site Location:</span> {siteLocation}</p>
              <p className="text-[9px] italic text-slate-600 pt-0.5">Subject to Nagpur Jurisdiction</p>
            </div>
          </div>
        </div>

        {/* Client & Service Info Bar */}
        <div className="grid grid-cols-12 gap-4 border border-slate-900 p-2.5 rounded-sm mb-3 bg-slate-50/50">
          <div className="col-span-8">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">To (M/s):</span>
            <p className="font-extrabold text-xs text-slate-900">{clientName}</p>
            {clientMobile && (
              <p className="text-[10px] text-slate-700">Mobile / Contact: <span className="font-semibold">{clientMobile}</span></p>
            )}
          </div>

          <div className="col-span-4 text-right border-l border-slate-300 pl-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Machine Details:</span>
            <p className="font-bold text-xs text-slate-900">{jcbType}</p>
            <p className="text-[10px] text-slate-700">Service Hours: <span className="font-semibold">{hoursWorked} hrs</span></p>
          </div>
        </div>

        {/* Billing Table */}
        <div className="border border-slate-900 overflow-hidden mb-3">
          <table className="w-full text-left text-[10.5px] border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[9.5px] tracking-wider border-b border-slate-900">
                <th className="p-2 text-center w-12 border-r border-slate-700">Sr. No.</th>
                <th className="p-2 border-r border-slate-700">Particulars & Work Log Details</th>
                <th className="p-2 text-center w-24 border-r border-slate-700">Hours / Qty</th>
                <th className="p-2 text-right w-24 border-r border-slate-700">Rate (₹)</th>
                <th className="p-2 text-right w-28">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {/* Row 1: JCB Work & Daily Work Entries Grid */}
              <tr>
                <td className="p-2 text-center align-top border-r border-slate-300 font-bold">1</td>
                <td className="p-2 align-top border-r border-slate-300 space-y-1.5">
                  <p className="font-extrabold text-slate-900">
                    JCB Earth Excavation & Material Handling Work ({jcbType})
                  </p>
                  {/* Tidy 3-Column Compact Grid for Multi-Day Log Entries */}
                  {workLog && workLog.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-slate-200">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                        Daily Log Breakdown ({workLog.length} Days):
                      </span>
                      <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[9px] bg-slate-50 p-1.5 rounded border border-slate-200">
                        {workLog.map((entry, idx) => (
                          <div key={idx} className="flex justify-between border-b border-slate-200/60 pb-0.5">
                            <span className="text-slate-600 font-medium">
                              {entry.date ? new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' }) : `Day ${idx + 1}`}:
                            </span>
                            <span className="font-bold text-slate-900">{entry.hours} hrs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-2 text-center align-top border-r border-slate-300 font-bold">{hoursWorked} hrs</td>
                <td className="p-2 text-right align-top border-r border-slate-300">{hourlyRate.toFixed(2)}</td>
                <td className="p-2 text-right align-top font-bold text-slate-900">{jcbAmount.toFixed(2)}</td>
              </tr>

              {/* Row 2: Per-Day Operator Bhatta */}
              {operatorCharge > 0 && (
                <tr>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">2</td>
                  <td className="p-2 align-top border-r border-slate-300 font-bold text-slate-900">
                    Operator Allowance / Bhatta ({operatorBhattaDays} Days)
                  </td>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">{operatorBhattaDays} Days</td>
                  <td className="p-2 text-right align-top border-r border-slate-300">{operatorBhattaRate.toFixed(2)}</td>
                  <td className="p-2 text-right align-top font-bold text-slate-900">{operatorCharge.toFixed(2)}</td>
                </tr>
              )}

              {/* Row 3: Fuel Surcharge */}
              {fuelCharge > 0 && (
                <tr>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">3</td>
                  <td className="p-2 align-top border-r border-slate-300 font-bold text-slate-900">
                    Fuel Surcharge
                  </td>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">1 Job</td>
                  <td className="p-2 text-right align-top border-r border-slate-300">{fuelCharge.toFixed(2)}</td>
                  <td className="p-2 text-right align-top font-bold text-slate-900">{fuelCharge.toFixed(2)}</td>
                </tr>
              )}

              {/* Row 4: Transport Charge */}
              {transportCharge > 0 && (
                <tr>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">4</td>
                  <td className="p-2 align-top border-r border-slate-300 font-bold text-slate-900">
                    Machine Transport / Towing Charge
                  </td>
                  <td className="p-2 text-center align-top border-r border-slate-300 font-bold">1 Trip</td>
                  <td className="p-2 text-right align-top border-r border-slate-300">{transportCharge.toFixed(2)}</td>
                  <td className="p-2 text-right align-top font-bold text-slate-900">{transportCharge.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary & Rupees in Words Section */}
        <div className="grid grid-cols-12 gap-3 mb-4">
          {/* Left: Rupees in Words & Notes */}
          <div className="col-span-7 flex flex-col justify-between border border-slate-900 p-2.5 rounded-sm bg-slate-50/40">
            <div>
              <span className="text-[9.5px] font-bold uppercase text-slate-500 block mb-0.5">Amount in Words:</span>
              <p className="font-extrabold text-xs text-slate-900 italic capitalize leading-snug">
                {rupeesInWords}
              </p>
            </div>

            {bill.notes && (
              <div className="mt-2 pt-2 border-t border-slate-300 text-[9.5px]">
                <span className="font-bold text-slate-700">Remarks:</span> {bill.notes}
              </div>
            )}
          </div>

          {/* Right: Subtotal, Taxes & Grand Total */}
          <div className="col-span-5 border border-slate-900 rounded-sm p-2 space-y-1 bg-slate-50/80">
            <div className="flex justify-between text-[10.5px]">
              <span className="font-bold text-slate-700">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            {gstAmount > 0 && (
              <div className="flex justify-between text-[10.5px]">
                <span className="font-bold text-slate-700">GST (18%):</span>
                <span className="font-semibold">{formatCurrency(gstAmount)}</span>
              </div>
            )}

            <div className="flex justify-between border-t-2 border-slate-900 pt-1.5 text-xs font-black text-slate-900">
              <span>GRAND TOTAL:</span>
              <span className="text-blue-900">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer Signatures - Exactly Aligned Authorized Signatory Block */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-[10px]">
          <div className="text-center w-48">
            <div className="border-b border-slate-900 pb-1 mb-1"></div>
            <p className="font-bold text-slate-900">Customer Signature</p>
          </div>

          {/* Authorized Signatory Block with For [Company Name] Directly Below */}
          <div className="text-right w-60">
            <div className="border-b border-slate-900 pb-1 mb-1"></div>
            <p className="font-bold text-xs text-slate-900">Authorized Signatory</p>
            <p className="text-[10px] font-medium text-slate-600 mt-0.5">For {companyName}</p>
          </div>
        </div>
      </div>

      {/* SINGLE PAGE A4 @media print STYLES - PREVENTS HEADER LEAKS */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print, nav, aside, header, button, .header-bar, .top-nav, h1.no-print {
            display: none !important;
          }

          .print-area {
            border: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }

          * {
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}