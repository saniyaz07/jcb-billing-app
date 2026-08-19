import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';
import {
  Users,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

export default function CustomerList({ onCustomerSelect }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  const handleSelect = (customer) => {
    setSelectedId(customer.id);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || ''
    });
    setShowForm(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setMessage('Customer name is required');

    try {
      if (editingId) {
        await updateCustomer(editingId, formData);
        setMessage('Customer updated successfully!');
        setEditingId(null);
      } else {
        const res = await createCustomer(formData);
        setMessage('Customer added successfully!');
        handleSelect(res.data);
      }

      setFormData({ name: '', phone: '', email: '', address: '' });
      setShowForm(false);
      await fetchCustomers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving customer:', err);
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(id);
      setMessage('Customer deleted successfully!');
      await fetchCustomers();
      if (selectedId === id) setSelectedId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const filtered = (customers || []).filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Customer Directory
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Manage your registered clients and contact records
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: '', phone: '', email: '', address: '' });
            setShowForm(true);
            setEditingId(null);
            setSelectedId(null);
          }}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Customer
        </button>
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
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none bg-slate-50"
          />
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          title="Refresh customers"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Add / Edit Form Modal/Card */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              {editingId ? 'Edit Customer Information' : 'Register New Customer'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
              required
            />
            <input
              type="tel"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
            />
            <input
              type="text"
              placeholder="Address / Location"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
            />
          </div>

          <div className="flex gap-3 pt-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              {editingId ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      )}

      {/* Customer Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading customer directory...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No customers registered</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start building your database by adding client contacts.
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', phone: '', email: '', address: '' });
              setShowForm(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Customer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const isSelected = selectedId === c.id;

            return (
              <div
                key={c.id}
                className={`bg-white p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      Client #{c.id}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 font-semibold text-xs rounded-lg transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}