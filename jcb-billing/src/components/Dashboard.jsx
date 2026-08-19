import { useState, useEffect } from 'react';
import { getBills, getCustomers } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  Clock,
  Users,
  PlusCircle,
  Eye,
  Settings,
  AlertTriangle,
  RefreshCw,
  Inbox,
  ArrowRight,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    totalCustomers: 0,
  });
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use Promise.allSettled to handle partial failures or slow endpoints gracefully
      const [billsRes, customersRes] = await Promise.allSettled([
        getBills(),
        getCustomers(),
      ]);

      let bills = [];
      let customers = [];

      if (billsRes.status === 'fulfilled' && billsRes.value?.data) {
        bills = Array.isArray(billsRes.value.data) ? billsRes.value.data : [];
      }

      if (customersRes.status === 'fulfilled' && customersRes.value?.data) {
        customers = Array.isArray(customersRes.value.data) ? customersRes.value.data : [];
      }

      if (billsRes.status === 'rejected' && customersRes.status === 'rejected') {
        throw new Error('Unable to fetch dashboard metrics from backend server.');
      }

      const totalRevenue = bills.reduce(
        (sum, bill) => sum + (parseFloat(bill.total_amount) || 0),
        0
      );

      const pendingAmount = bills
        .filter((bill) => (bill.payment_status || '').toLowerCase() === 'pending')
        .reduce((sum, bill) => sum + (parseFloat(bill.total_amount) || 0), 0);

      setStats({
        totalBills: bills.length,
        totalRevenue,
        pendingAmount,
        totalCustomers: customers.length,
      });

      // Sort by date or id descending if available, and take top 5
      setRecentBills(bills.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Indian Rupee standard currency formatter (WCAG accessible contrast & clean display)
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Welcome to your JCB Billing Management System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs rounded-xl shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/create-bill"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Bill
          </Link>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Stats Cards Grid - Soft Pastels & WCAG Accessible Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Bills */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Total Invoices
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-slate-100 rounded animate-pulse"></span>
                ) : (
                  stats.totalBills
                )}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">All-time invoices created</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Total Revenue
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {loading ? (
                  <span className="inline-block w-24 h-7 bg-slate-100 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats.totalRevenue)
                )}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Total earned from bills</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Pending Balance
              </p>
              <h3 className="text-2xl font-extrabold text-amber-700">
                {loading ? (
                  <span className="inline-block w-24 h-7 bg-slate-100 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats.pendingAmount)
                )}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Awaiting customer payment</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Total Customers
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-slate-100 rounded animate-pulse"></span>
                ) : (
                  stats.totalCustomers
                )}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Registered client records</p>
        </div>
      </div>

      {/* Recent Bills Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Recent Bills</h2>
          </div>
          {recentBills.length > 0 && !loading && (
            <Link
              to="/bills"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <span>View All Bills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Skeleton Loader State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between p-4 border-b border-slate-100 rounded-lg bg-slate-50/50"
              >
                <div className="flex items-center gap-4 w-1/3">
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : recentBills.length === 0 ? (
          /* Dedicated Empty State */
          <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <Inbox className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No recent invoices found</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't generated any JCB billing invoices yet. Click below to create your first bill.
              </p>
            </div>
            <Link
              to="/create-bill"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create First Bill
            </Link>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4 rounded-l-lg">Invoice #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBills.map((bill) => {
                  const isPaid = (bill.payment_status || '').toLowerCase() === 'paid';

                  return (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-4 font-semibold text-blue-600 group-hover:text-blue-700">
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
                        <Link
                          to={`/bills/${bill.id}`}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold text-xs px-2.5 py-1 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {recentBills.length > 0 && !loading && (
          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              to="/bills"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              <span>View All Recent Invoices ({stats.totalBills})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Standardized Quick Action Button Grid - Uniform Heights, Clean Styling & Labels */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Create New Bill */}
          <Link
            to="/create-bill"
            className="group flex flex-col justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full"
          >
            <div>
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Create New Bill
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate & issue a new JCB billing invoice
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start Bill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Action 2: Manage Customers */}
          <Link
            to="/customer-list"
            className="group flex flex-col justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 h-full"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Manage Customers
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit & view registered customer profiles
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Manage Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Action 3: View Reports */}
          <Link
            to="/reports"
            className="group flex flex-col justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 h-full"
          >
            <div>
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                View Reports
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Revenue analytics & payment status charts
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Action 4: Business Settings */}
          <Link
            to="/settings"
            className="group flex flex-col justify-between p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 h-full"
          >
            <div>
              <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Business Settings
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update company info, GST & bank details
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Edit Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}