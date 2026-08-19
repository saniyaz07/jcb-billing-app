import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BillForm from '../components/BillForm';
import { createBill, getCustomers, createCustomer } from '../services/api';
import { Calendar, PlusCircle, Trash2, Users, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function CreateBill() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [totalHours, setTotalHours] = useState(8);

  // Daily work entries with min 0 hours protection
  const [workEntries, setWorkEntries] = useState([
    { date: new Date().toISOString().split('T')[0], hours: 8, startTime: '09:00', endTime: '17:00' }
  ]);

  // Minimal customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
  });

  // Fetch customers on load
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await getCustomers();
        const list = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setCustomers(list);
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };
    loadCustomers();
  }, []);

  // Calculate total hours - non-negative validation
  useEffect(() => {
    const total = workEntries.reduce((sum, entry) => {
      const h = parseFloat(entry.hours || 0);
      return sum + (h > 0 ? h : 0);
    }, 0);
    setTotalHours(Math.max(0, total));
  }, [workEntries]);

  // Add work day entry
  const addWorkDay = () => {
    let nextDate;
    if (workEntries.length === 0) {
      nextDate = new Date();
    } else {
      const last = new Date(workEntries[workEntries.length - 1].date || new Date());
      if (isNaN(last.getTime())) {
        nextDate = new Date();
      } else {
        last.setDate(last.getDate() + 1);
        nextDate = last;
      }
    }

    const formattedDate = nextDate.toISOString().split('T')[0];

    setWorkEntries([
      ...workEntries,
      { date: formattedDate, hours: 8, startTime: '09:00', endTime: '17:00' }
    ]);
  };

  // Remove work day entry
  const removeWorkDay = (index) => {
    if (workEntries.length > 1) {
      setWorkEntries(workEntries.filter((_, i) => i !== index));
    }
  };

  // Update work day entry with min 0 hours validation
  const updateWorkDay = (index, field, value) => {
    const updated = [...workEntries];

    if (field === 'hours') {
      const val = parseFloat(value);
      updated[index][field] = isNaN(val) ? 0 : Math.max(0, val);
    } else if (field === 'startTime' || field === 'endTime') {
      updated[index][field] = value;
      const start = updated[index].startTime;
      const end = updated[index].endTime;

      if (start && end) {
        const startDate = new Date(`1970-01-01T${start}`);
        const endDate = new Date(`1970-01-01T${end}`);
        let diffHours = (endDate - startDate) / (1000 * 60 * 60);

        // If end time is earlier than start time, set diff to 0 (minimum 0 hours)
        if (isNaN(diffHours) || diffHours < 0) {
          diffHours = 0;
        }

        updated[index].hours = Math.max(0, diffHours);
      }
    } else {
      updated[index][field] = value;
    }

    setWorkEntries(updated);
  };

  // Add new customer inline
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) return;

    try {
      const response = await createCustomer(newCustomer);
      const created = response.data;
      setCustomers((prev) => [...prev, created]);
      setNewCustomer({ name: '', phone: '' });
      setShowAddCustomer(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Submit bill with comprehensive client-side validations
  const handleSubmit = async (formData) => {
    // 1. Required field validations
    if (!formData.customer_name && !formData.customer_id) {
      setMessage('❌ Please select or enter a Customer Name!');
      return;
    }

    if (!formData.site_location || !formData.site_location.trim()) {
      setMessage('❌ Site Name / Location is required!');
      return;
    }

    if (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0) {
      setMessage('❌ Hourly Rate must be greater than ₹0!');
      return;
    }

    if (!formData.bill_date) {
      setMessage('❌ Invoice Bill Date is required!');
      return;
    }

    // 2. Non-negative validations
    if (totalHours < 0 || (formData.hours_worked !== undefined && parseFloat(formData.hours_worked) < 0)) {
      setMessage('❌ Total Work Hours cannot be negative!');
      return;
    }

    const subtotal =
      parseFloat(formData.hours_worked || 0) * parseFloat(formData.hourly_rate || 0) +
      Math.max(0, parseFloat(formData.operator_charge || 0)) +
      Math.max(0, parseFloat(formData.fuel_charge || 0)) +
      Math.max(0, parseFloat(formData.transport_charge || 0));

    const gst = formData.include_gst ? subtotal * 0.18 : 0;
    const grandTotal = subtotal + gst;

    if (grandTotal < 0) {
      setMessage('❌ Grand Total cannot be negative!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...formData,
        hours_worked: Math.max(0, totalHours),
        hourly_rate: Math.max(0, parseFloat(formData.hourly_rate || 0)),
        operator_charge: Math.max(0, parseFloat(formData.operator_charge || 0)),
        fuel_charge: Math.max(0, parseFloat(formData.fuel_charge || 0)),
        transport_charge: Math.max(0, parseFloat(formData.transport_charge || 0)),
        subtotal: Math.max(0, subtotal),
        gst_amount: Math.max(0, gst),
        total_amount: Math.max(0, grandTotal),
        work_log: workEntries,
      };

      const response = await createBill(payload);
      setMessage('✅ Bill created successfully!');

      setTimeout(() => {
        if (response?.data?.id) {
          navigate(`/bills/${response.data.id}`);
        } else {
          navigate('/bills');
        }
      }, 1500);
    } catch (error) {
      const serverErr = error.response?.data?.error || error.message || 'Failed to submit bill';
      setMessage('❌ Server Error: ' + serverErr);
      console.error('Submit Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Create New Bill
          </h1>
          <p className="text-slate-500 text-sm">
            Fill in job details to generate an itemized JCB billing statement
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            message.startsWith('❌')
              ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
          }`}
        >
          {message.startsWith('❌') ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Daily Work Log Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Daily Work Log Breakdown</span>
          </div>
          <button
            type="button"
            onClick={addWorkDay}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Work Day
          </button>
        </div>

        <div className="space-y-3">
          {workEntries.map((entry, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-end gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Work Date #{index + 1}
                </label>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateWorkDay(index, 'date', e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={entry.startTime || '09:00'}
                  onChange={(e) => updateWorkDay(index, 'startTime', e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={entry.endTime || '17:00'}
                  onChange={(e) => updateWorkDay(index, 'endTime', e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Hours (Min 0)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={entry.hours}
                  onChange={(e) => updateWorkDay(index, 'hours', e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {workEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkDay(index)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                  title="Delete work day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Calculated Total Work Hours:</span>
          </div>
          <span className="font-extrabold text-sm text-blue-700">{totalHours.toFixed(1)} hrs</span>
        </div>
      </div>

      {/* Add New Customer Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Register New Customer (Optional)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCustomer(!showAddCustomer)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
          >
            {showAddCustomer ? 'Close' : '+ Add Client'}
          </button>
        </div>

        {showAddCustomer && (
          <form onSubmit={handleAddCustomer} className="space-y-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Customer / Company Name *"
                value={newCustomer.name}
                onChange={handleCustomerChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={handleCustomerChange}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-semibold text-xs py-2 rounded-xl hover:bg-emerald-700 transition"
            >
              Save & Auto Select Customer
            </button>
          </form>
        )}
      </div>

      {/* Main Bill Form */}
      <BillForm
        onSubmit={handleSubmit}
        loading={loading}
        totalHours={totalHours}
        workEntries={workEntries}
        customers={customers}
        selectedCustomerId={null}
      />
    </div>
  );
}