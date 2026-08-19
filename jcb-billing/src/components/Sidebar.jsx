import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
  Truck,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Invoices / Bills',
      path: '/bills',
      icon: FileText,
    },
    {
      name: 'Create Bill',
      path: '/create-bill',
      icon: PlusCircle,
    },
    {
      name: 'Customers',
      path: '/customer-list',
      icon: Users,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto no-print transition-all">
      {/* Top Header & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-amber-400 p-2 rounded-xl text-slate-950 shadow-md shadow-amber-500/20">
            <Truck className="w-6 h-6 stroke-[2.25]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight mb-0">
              JCB Billing
            </h1>
            <p className="text-xs text-slate-400 font-medium">Management System</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-6">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Main Navigation
          </p>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-4 border-blue-500 rounded-l-none pl-2.5 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active
                          ? 'text-blue-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-blue-400" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Status */}
      <div className="p-4 m-3 bg-slate-800/50 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">JCB Enterprise</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-400">System Ready</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
