import { useState, useEffect } from 'react';
import { Building2, Users, MapPin, Phone, FileText, Calendar, PlusCircle, Trash2, CheckCircle2, DollarSign } from 'lucide-react';

export default function BillForm({
  initialData,
  onSubmit,
  loading,
  totalHours = 0,
  workEntries = [],
  customers = [],
  selectedCustomerId = null,
}) {
  // Load saved defaults from localStorage or fallback
  const getSavedBusinessDefaults = () => {
    try {
      const saved = localStorage.getItem('jcb_business_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      company_name: 'A.B.S. ASHRAF SHEIKH',
      company_tagline: 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
      company_phone: '9371775288, 9970434903',
      default_site_location: 'Rachana',
    };
  };

  const defaults = getSavedBusinessDefaults();

  const [formData, setFormData] = useState({
    bill_number: initialData?.bill_number || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    bill_date: initialData?.bill_date || new Date().toISOString().split('T')[0],
    service_date: initialData?.service_date || new Date().toISOString().split('T')[0],
    customer_id: initialData?.customer_id || selectedCustomerId || '',
    customer_name: initialData?.customer_name || 'Jay Chand Bala Buildcon OPC Pvt. Ltd.',
    customer_phone: initialData?.customer_phone || '9876543210',
    site_location: initialData?.site_location || defaults.default_site_location || 'Rachana',
    company_name: initialData?.company_name || defaults.company_name || 'A.B.S. ASHRAF SHEIKH',
    company_tagline: initialData?.company_tagline || defaults.company_tagline || 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
    company_phone: initialData?.company_phone || defaults.company_phone || '9371775288, 9970434903',
    jcb_type: initialData?.jcb_type || 'JCB 3DX Super',
    hours_worked: totalHours || initialData?.hours_worked || 8,
    hourly_rate: initialData?.hourly_rate || 500,
    operator_charge: initialData?.operator_charge || 0,
    fuel_charge: initialData?.fuel_charge || 0,
    transport_charge: initialData?.transport_charge || 0,
    include_gst: initialData?.include_gst !== undefined ? initialData.include_gst : false,
    notes: initialData?.notes || '',
  });

  // Sync total hours when prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      hours_worked: totalHours || prev.hours_worked,
    }));
  }, [totalHours]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCustomerSelect = (e) => {
    const id = e.target.value;
    const selected = customers.find((c) => String(c.id) === String(id));
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        customer_id: selected.id,
        customer_name: selected.name,
        customer_phone: selected.phone || prev.customer_phone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customer_id: id,
      }));
    }
  };

  // Computations
  const subtotal =
    parseFloat(formData.hours_worked || 0) * parseFloat(formData.hourly_rate || 0) +
    parseFloat(formData.operator_charge || 0) +
    parseFloat(formData.fuel_charge || 0) +
    parseFloat(formData.transport_charge || 0);

  const gst = formData.include_gst ? subtotal * 0.18 : 0;
  const total = subtotal + gst;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      subtotal,
      gst_amount: gst,
      total_amount: total,
      work_log: workEntries,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
      {/* Business Header Customization */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Business Header & Contacts (Editable per Bill)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company / Owner Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g., A.B.S. ASHRAF SHEIKH"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Business Contact Numbers
            </label>
            <input
              type="text"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
              placeholder="e.g., 9371775288, 9970434903"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company Tagline & Address
            </label>
            <input
              type="text"
              name="company_tagline"
              value={formData.company_tagline}
              onChange={handleChange}
              placeholder="e.g., Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Invoice & Client Information */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Users className="w-5 h-5 text-emerald-600" />
          <span>Client & Invoice Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Customer / M/s *
            </label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleCustomerSelect}
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Client / M/s Company Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="e.g., Jay Chand Bala Buildcon OPC Pvt. Ltd."
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Client Mobile Number
            </label>
            <input
              type="text"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="e.g., 9876543210"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Site Name / Location *
            </label>
            <input
              type="text"
              name="site_location"
              value={formData.site_location}
              onChange={handleChange}
              placeholder="e.g., Rachana"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Invoice / Bill Number *
            </label>
            <input
              type="text"
              name="bill_number"
              value={formData.bill_number}
              onChange={handleChange}
              placeholder="e.g., INV-1001"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Bill Date *
            </label>
            <input
              type="date"
              name="bill_date"
              value={formData.bill_date}
              onChange={handleChange}
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              required
            />
          </div>
        </div>
      </div>

      {/* JCB Service Details */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>JCB Service & Charges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              JCB Machine Type
            </label>
            <input
              type="text"
              name="jcb_type"
              value={formData.jcb_type}
              onChange={handleChange}
              placeholder="e.g., JCB 3DX Super"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Work Hours (Auto Calculated)
            </label>
            <input
              type="number"
              name="hours_worked"
              value={formData.hours_worked}
              readOnly
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-slate-100 text-slate-700 font-bold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hourly Rate (₹) *
            </label>
            <input
              type="number"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              placeholder="500"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Operator Bhatta / Charge (₹)
            </label>
            <input
              type="number"
              name="operator_charge"
              value={formData.operator_charge}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fuel Charge (₹)
            </label>
            <input
              type="number"
              name="fuel_charge"
              value={formData.fuel_charge}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transport Charge (₹)
            </label>
            <input
              type="number"
              name="transport_charge"
              value={formData.transport_charge}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
              min="0"
            />
          </div>
        </div>

        {/* GST Toggle Option */}
        <div className="pt-2 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="include_gst"
              checked={formData.include_gst}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span>Include 18% GST in Calculation</span>
          </label>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="font-bold text-slate-900 text-base">Bill Calculation Summary</h4>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>JCB Work ({formData.hours_worked} hrs × ₹{formData.hourly_rate}):</span>
            <span className="font-semibold text-slate-800">
              ₹{(parseFloat(formData.hours_worked || 0) * parseFloat(formData.hourly_rate || 0)).toFixed(2)}
            </span>
          </div>
          {parseFloat(formData.operator_charge) > 0 && (
            <div className="flex justify-between">
              <span>Operator Bhatta Charge:</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(formData.operator_charge).toFixed(2)}</span>
            </div>
          )}
          {parseFloat(formData.fuel_charge) > 0 && (
            <div className="flex justify-between">
              <span>Fuel Charge:</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(formData.fuel_charge).toFixed(2)}</span>
            </div>
          )}
          {parseFloat(formData.transport_charge) > 0 && (
            <div className="flex justify-between">
              <span>Transport Charge:</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(formData.transport_charge).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-slate-800">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {formData.include_gst && (
            <div className="flex justify-between text-slate-600">
              <span>GST (18%):</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-extrabold text-base text-slate-900">
            <span>Grand Total:</span>
            <span className="text-blue-700">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Work Notes / Additional Remarks
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g. Site excavation work at Rachana location, soil filling & leveling."
          rows={3}
          className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-blue-500 bg-slate-50"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition disabled:opacity-50"
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>{loading ? 'Processing...' : 'Generate & Save Invoice'}</span>
      </button>
    </form>
  );
}