import { useState, useEffect } from 'react';
import { saveBusiness, getBusiness } from '../services/api';
import {
  Settings as SettingsIcon,
  Building2,
  CreditCard,
  Pencil,
  CheckCircle2,
  XCircle,
  Info,
  Save,
  RefreshCw,
  Phone,
  MapPin,
  FileCheck
} from 'lucide-react';

export default function Settings() {
  const [businessData, setBusinessData] = useState({
    company_name: 'A.B.S. ASHRAF SHEIKH',
    owner_name: 'Ashraf Sheikh',
    phone: '9371775288, 9970434903',
    company_tagline: 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
    address: 'I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
    gst_number: '',
    bank_name: 'State Bank of India',
    account_number: '1234567890',
    ifsc: 'SBIN0001234',
    default_site_location: 'Rachana',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      // First load from localStorage if present
      const saved = localStorage.getItem('jcb_business_settings');
      if (saved) {
        setBusinessData((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }

      // Then fetch from backend API
      const response = await getBusiness();
      if (response?.data) {
        const data = response.data;
        const merged = {
          company_name: data.company_name || 'A.B.S. ASHRAF SHEIKH',
          owner_name: data.owner_name || 'Ashraf Sheikh',
          phone: data.phone || '9371775288, 9970434903',
          company_tagline: data.company_tagline || 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
          address: data.address || 'I.B.M. Road, Gittikhadan, Katol Road, Nagpur',
          gst_number: data.gst_number || '',
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          ifsc: data.ifsc_code || data.ifsc || '',
          default_site_location: data.default_site_location || 'Rachana',
        };
        setBusinessData((prev) => ({ ...prev, ...merged }));
        localStorage.setItem('jcb_business_settings', JSON.stringify(merged));
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Save locally
      localStorage.setItem('jcb_business_settings', JSON.stringify(businessData));

      // Save to backend API
      await saveBusiness(businessData);
      setMessage('Business information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      // Even if backend fails, saved locally
      setMessage('Settings saved locally! (Backend note: ' + error.message + ')');
      setIsEditing(false);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Business Settings
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Manage your JCB enterprise profiles, print header defaults & bank details
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit Settings
          </button>
        )}
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            message.toLowerCase().includes('error')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {message.toLowerCase().includes('error') ? (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Form / View Section */}
      {isEditing ? (
        /* Edit Mode */
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8"
        >
          {/* Company Details */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Company Header & Contact Defaults</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Owner Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={businessData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. A.B.S. ASHRAF SHEIKH"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone Numbers *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleChange}
                  placeholder="9371775288, 9970434903"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company Tagline & Service Description
                </label>
                <input
                  type="text"
                  name="company_tagline"
                  value={businessData.company_tagline}
                  onChange={handleChange}
                  placeholder="e.g. Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Site Location
                </label>
                <input
                  type="text"
                  name="default_site_location"
                  value={businessData.default_site_location}
                  onChange={handleChange}
                  placeholder="e.g. Rachana"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  GST Number (If applicable)
                </label>
                <input
                  type="text"
                  name="gst_number"
                  value={businessData.gst_number}
                  onChange={handleChange}
                  placeholder="27AAAAA0000A1Z5"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Bank Account Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={businessData.bank_name}
                  onChange={handleChange}
                  placeholder="State Bank of India"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={businessData.account_number}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={businessData.ifsc}
                  onChange={handleChange}
                  placeholder="SBIN0001234"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* View Mode Card */
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Company Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">Company / Owner Name</span>
                <p className="text-base font-bold text-slate-900">
                  {businessData.company_name || 'A.B.S. ASHRAF SHEIKH'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">Contact Numbers</span>
                <p className="text-sm font-semibold text-slate-800">
                  {businessData.phone || '9371775288, 9970434903'}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-slate-500 font-medium block mb-1">Company Tagline & Address</span>
                <p className="text-sm font-medium text-slate-800">
                  {businessData.company_tagline || 'Available JCB, TIPPER & EARTH MOVERS - I.B.M. Road, Gittikhadan, Katol Road, Nagpur'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">Default Site Location</span>
                <p className="text-sm font-semibold text-slate-800">
                  {businessData.default_site_location || 'Rachana'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">GST Number</span>
                <p className="text-sm font-semibold text-slate-800">
                  {businessData.gst_number || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details View */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Bank Account Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">Bank Name</span>
                <p className="text-sm font-bold text-slate-900">
                  {businessData.bank_name || 'State Bank of India'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">Account Number</span>
                <p className="text-sm font-semibold text-slate-800">
                  {businessData.account_number || '1234567890'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">IFSC Code</span>
                <p className="text-sm font-semibold text-slate-800">
                  {businessData.ifsc || 'SBIN0001234'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-800 text-xs">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              These settings serve as sensible default values when creating new invoices and printed A4 PDF bills.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
