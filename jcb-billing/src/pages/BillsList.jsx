import { useState, useEffect } from "react";
import { getBills, deleteBill } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Inbox,
  Search,
  AlertTriangle
} from "lucide-react";

export default function BillsList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await getBills();
      setBills(response.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setMessage('Error loading bills from server');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) return;

    try {
      await deleteBill(id);
      setMessage('Bill deleted successfully!');
      await fetchBills();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting bill:", error);
      setMessage('Error deleting bill');
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Filter bills by search and status
  const filteredBills = bills.filter((bill) => {
    const statusMatch =
      filterStatus === 'All' ||
      (bill.payment_status || '').toLowerCase() === filterStatus.toLowerCase();
    const searchMatch =
      (bill.bill_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              All Invoices
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Manage and track all generated billing statements
          </p>
        </div>

        <button
          onClick={() => navigate('/create-bill')}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Bill
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            message.toLowerCase().includes('error')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none bg-slate-50"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Paid', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={fetchBills}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-500 text-sm">Loading bills database...</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {bills.length === 0 ? 'No bills created yet' : 'No matching bills found'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {bills.length === 0
                  ? 'Generate your first bill to start tracking invoices.'
                  : 'Try adjusting your search terms or filters.'}
              </p>
            </div>
            {bills.length === 0 && (
              <button
                onClick={() => navigate('/create-bill')}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Create First Bill
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map((bill) => {
                  const isPaid = (bill.payment_status || '').toLowerCase() === 'paid';

                  return (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-4 font-semibold text-blue-600">
                        {bill.bill_number}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {bill.customer_name || 'N/A'}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {bill.bill_date
                          ? new Date(bill.bill_date).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900">
                        {formatCurrency(bill.total_amount)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{bill.payment_status || 'Pending'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/bills/${bill.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs px-2.5 py-1 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(bill.id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold text-xs px-2.5 py-1 hover:bg-rose-50 rounded-lg transition"
                            title="Delete bill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}