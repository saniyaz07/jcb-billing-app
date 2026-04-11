import { useState, useEffect } from 'react';
import { saveBusiness, getBusiness } from '../services/api';
import { getBills, getCustomers } from '../services/api';  // Go up 1 level
export default function Settings() {
  const [businessData, setBusinessData] = useState({
    company_name: '',
    owner_name: '',
    phone: '',
    address: '',
    gst_number: '',
    bank_name: '',
    account_number: '',
    ifsc: '',
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
      const response = await getBusiness();
      if (response.data) {
        setBusinessData({
          company_name: response.data.company_name || '',
          owner_name: response.data.owner_name || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          gst_number: response.data.gst_number || '',
          bank_name: response.data.bank_name || '',
          account_number: response.data.account_number || '',
          ifsc: response.data.ifsc_code || '',
        });
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({
      ...businessData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await saveBusiness(businessData);
      setMessage('✅ Business information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('❌ Error saving business information: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Business Settings</h1>
          <p className="text-gray-600">Manage your JCB business information</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Edit/View Toggle */}
        {!isEditing && (
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              ✏️ Edit Information
            </button>
          </div>
        )}

        {/* Form/Display Section */}
        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={businessData.company_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={businessData.owner_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={businessData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={businessData.gst_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={businessData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">💳 Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={businessData.bank_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={businessData.account_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifsc"
                    value={businessData.ifsc}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '⏳ Saving...' : '✅ Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.company_name || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Owner Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.owner_name || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.phone || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">GST Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.gst_number || '—'}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.address || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">💳 Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.bank_name || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.account_number || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {businessData.ifsc || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-700">
                ℹ️ This information will be displayed on all your invoices. Keep it updated!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
