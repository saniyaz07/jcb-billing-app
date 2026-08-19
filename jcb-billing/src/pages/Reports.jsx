import { useState, useEffect } from 'react';
import { getBills, getCustomers } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  RefreshCw,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

export default function Reports() {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [billsRes, customersRes] = await Promise.allSettled([
        getBills(),
        getCustomers(),
      ]);

      const billsData = billsRes.status === 'fulfilled' ? (billsRes.value?.data || []) : [];
      const customersData = customersRes.status === 'fulfilled' ? (customersRes.value?.data || []) : [];

      if (billsRes.status === 'rejected' && customersRes.status === 'rejected') {
        throw new Error('Failed to load report data from server');
      }

      setBills(billsData);
      setCustomers(customersData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Indian Rupee currency formatter
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalRevenue = bills.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
  const paidBills = bills.filter((b) => (b.payment_status || '').toLowerCase() === 'paid');
  const pendingBills = bills.filter((b) => (b.payment_status || '').toLowerCase() === 'pending');

  const paidAmount = paidBills.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
  const pendingAmount = pendingBills.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);

  const paidPercentage = totalRevenue > 0 ? Math.round((paidAmount / totalRevenue) * 100) : 0;
  const pendingPercentage = totalRevenue > 0 ? Math.round((pendingAmount / totalRevenue) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Business Reports & Analytics
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Overview of revenue, payment collections, and invoice statistics.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-rose-600 text-white font-medium rounded-lg text-xs hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Invoiced
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-1">{bills.length}</p>
          <p className="text-xs text-slate-500">All-time generated bills</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-1">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-slate-500">Total billings accumulated</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Collected Paid
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mb-1">
            {formatCurrency(paidAmount)}
          </p>
          <p className="text-xs text-slate-500">{paidBills.length} fully paid invoices</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Awaiting
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mb-1">
            {formatCurrency(pendingAmount)}
          </p>
          <p className="text-xs text-slate-500">{pendingBills.length} pending payments</p>
        </div>
      </div>

      {/* Revenue Breakdown & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Breakdown</h3>

          {loading ? (
            <div className="space-y-4 py-6">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-slate-100 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>Paid Collections ({paidPercentage}%)</span>
                  <span>Pending Balance ({pendingPercentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${paidPercentage}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                  ></div>
                  <div
                    style={{ width: `${pendingPercentage}%` }}
                    className="bg-amber-400 h-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1 text-emerald-800 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Paid Invoices</span>
                  </div>
                  <p className="text-xl font-bold text-emerald-900">
                    {formatCurrency(paidAmount)}
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    {paidBills.length} out of {bills.length} bills settled
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-2 mb-1 text-amber-800 font-semibold text-sm">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pending Invoices</span>
                  </div>
                  <p className="text-xl font-bold text-amber-900">
                    {formatCurrency(pendingAmount)}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {pendingBills.length} out of {bills.length} awaiting payment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Insights Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Customer Insights</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Registered customers: <strong className="text-slate-900">{customers.length}</strong>
            </p>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span>Avg Revenue / Bill:</span>
                <span className="font-semibold text-slate-800">
                  {bills.length > 0
                    ? formatCurrency(totalRevenue / bills.length)
                    : formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Collection Rate:</span>
                <span className="font-semibold text-emerald-600">{paidPercentage}%</span>
              </div>
            </div>
          </div>

          <Link
            to="/bills"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            <span>View Detailed Bills</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
