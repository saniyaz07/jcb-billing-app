import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import CreateBill from "./pages/CreateBill";
import BillsList from "./pages/BillsList";
import ViewBill from "./pages/ViewBill";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        {/* Modern Responsive Sidebar */}
        <Sidebar />

        {/* Main Application Area */}
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-bill" element={<CreateBill />} />
            <Route path="/bills" element={<BillsList />} />
            <Route path="/bills/:id" element={<ViewBill />} />
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;