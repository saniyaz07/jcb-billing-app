import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BillPreview from '../components/BillPreview';
import { getBillById, getBusiness, updateBill, getCustomers } from '../services/api';
import { ArrowLeft, Pencil, Save, XCircle, CheckCircle2 } from 'lucide-react';

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

  const [editData, setEditData] = useState({
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    site_location: 'Rachana',
    company_name: 'A.B.S. ASHRAF SHEIKH',
    company_tagline: 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
    company_phone: '9371775288, 9970434903',
    bill_number: '',
    bill_date: '',
    service_date: '',
    jcb_type: 'JCB 3DX Super',
    hours_worked: 8,
    hourly_rate: 500,
    operator_bhatta_rate_per_day: 200,
    operator_bhatta_days: 1,
    operator_charge: 200,
    fuel_charge: 0,
    transport_charge: 0,
    notes: '',
    payment_status: 'Pending',
  });

  useEffect(() => {
    fetchBillData();
    fetchCustomers();
  }, [id]);

  const fetchBillData = async () => {
    setLoading(true);
    try {
      const [billRes, bizRes] = await Promise.all([
        getBillById(id),
        getBusiness(),
      ]);

      const billData = billRes.data || {};
      const bizData = bizRes.data || {};

      setBill(billData);
      setBusiness(bizData);

      const days = billData.operator_bhatta_days || (billData.work_log && billData.work_log.length > 0 ? billData.work_log.length : 1);
      const rate = billData.operator_bhatta_rate_per_day !== undefined ? parseFloat(billData.operator_bhatta_rate_per_day) : 200;

      setEditData({
        customer_id: billData.customer_id || '',
        customer_name: billData.customer_name || '',
        customer_phone: billData.customer_phone || billData.phone || '',
        site_location: billData.site_location || 'Rachana',
        company_name: billData.company_name || bizData.company_name || 'A.B.S. ASHRAF SHEIKH',
        company_tagline: billData.company_tagline || bizData.company_tagline || '',
        company_phone: billData.company_phone || bizData.phone || '9371775288, 9970434903',
        bill_number: billData.bill_number || '',
        bill_date: billData.bill_date ? new Date(billData.bill_date).toISOString().split('T')[0] : '',
        service_date: billData.service_date ? new Date(billData.service_date).toISOString().split('T')[0] : '',
        jcb_type: billData.jcb_type || 'JCB 3DX Super',
        hours_worked: billData.hours_worked || 0,
        hourly_rate: billData.hourly_rate || 500,
        operator_bhatta_rate_per_day: rate,
        operator_bhatta_days: days,
        operator_charge: billData.operator_charge !== undefined ? billData.operator_charge : (days * rate),
        fuel_charge: billData.fuel_charge || 0,
        transport_charge: billData.transport_charge || 0,
        notes: billData.notes || '',
        payment_status: billData.payment_status || 'Pending',
      });
    } catch (error) {
      console.error('Error loading bill:', error);
      setMessage('Error loading bill details');
    }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'operator_bhatta_rate_per_day' || name === 'operator_bhatta_days') {
        const r = parseFloat(name === 'operator_bhatta_rate_per_day' ? value : updated.operator_bhatta_rate_per_day) || 0;
        const d = parseFloat(name === 'operator_bhatta_days' ? value : updated.operator_bhatta_days) || 0;
        updated.operator_charge = Math.max(0, r * d);
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const hours = Math.max(0, parseFloat(editData.hours_worked || 0));
    const rate = Math.max(0, parseFloat(editData.hourly_rate || 0));
    const opCharge = Math.max(0, parseFloat(editData.operator_charge || 0));
    const fuel = Math.max(0, parseFloat(editData.fuel_charge || 0));
    const transport = Math.max(0, parseFloat(editData.transport_charge || 0));

    const subtotal = (hours * rate) + opCharge + fuel + transport;
    const gst = bill?.gst_amount > 0 ? subtotal * 0.18 : 0;
    const total = subtotal + gst;

    try {
      const payload = {
        ...editData,
        hours_worked: hours,
        hourly_rate: rate,
        operator_charge: opCharge,
        fuel_charge: fuel,
        transport_charge: transport,
        subtotal,
        gst_amount: gst,
        total_amount: total,
      };

      await updateBill(id, payload);
      setMessage('✅ Bill updated successfully!');
      setIsEditing(false);
      await fetchBillData();
    } catch (err) {
      console.error('Error updating bill:', err);
      setMessage('❌ Error saving bill changes: ' + err.message);
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-medium">
        Loading invoice details...
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <p className="text-slate-700 font-bold text-lg">Invoice not found</p>
        <button
          onClick={() => navigate('/bills')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bills List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header Bar (STRICTLY HIDDEN IN PRINT PREVIEW TO PREVENT HEADER LEAKS) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Invoice #{bill.bill_number}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            View, edit, or print A4 invoice statement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Invoice
              </button>
              <button
                onClick={() => navigate('/bills')}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Bills
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm no-print ${
            message.includes('✅')
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Edit Mode vs Preview Mode */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 no-print">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Edit Invoice Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Client / M/s Name
              </label>
              <input
                type="text"
                name="customer_name"
                value={editData.customer_name}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Site Name / Location
              </label>
              <input
                type="text"
                name="site_location"
                value={editData.site_location}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                name="bill_date"
                value={editData.bill_date}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                name="hourly_rate"
                value={editData.hourly_rate}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Operator Bhatta Rate / Day (₹)
              </label>
              <input
                type="number"
                name="operator_bhatta_rate_per_day"
                value={editData.operator_bhatta_rate_per_day}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Operator Bhatta Total Days
              </label>
              <input
                type="number"
                name="operator_bhatta_days"
                value={editData.operator_bhatta_days}
                onChange={handleEditChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-50"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <BillPreview
          bill={bill}
          customer={{
            name: bill.customer_name,
            phone: bill.customer_phone || bill.phone,
            address: bill.address,
            email: bill.email,
          }}
          business={business}
        />
      )}
    </div>
  );
}