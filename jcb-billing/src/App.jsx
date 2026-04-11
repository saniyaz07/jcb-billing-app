// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import CreateBill from "./pages/CreateBill";
// import BillsList from "./pages/BillsList";
// import ViewBill from "./pages/ViewBill";
// import Settings from "./pages/Settings";
// import CustomerList from "./components/CustomerList";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <div className="w-64 bg-blue-600 text-white p-5">
//           <h1 className="text-2xl font-bold mb-6">🚜 JCB Billing</h1>
          
//           <nav className="flex flex-col gap-3">
//             <Link to="/" className="hover:bg-blue-500 p-2 rounded">Dashboard</Link>
//             <Link to="/create-bill" className="hover:bg-blue-500 p-2 rounded">Create Bill</Link>
//             <Link to="/bills" className="hover:bg-blue-500 p-2 rounded">Bills</Link>
//             <Link to="/settings" className="hover:bg-blue-500 p-2 rounded">Settings</Link>
//             <Link to="/customer-list" className="hover:bg-blue-500 p-2 rounded">Customer List</Link>
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6 bg-gray-100">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/create-bill" element={<CreateBill />} />
//             <Route path="/bills" element={<BillsList />} />
//             <Route path="/bills/:id" element={<ViewBill />} />
//             <Route path="/settings" element={<Settings />} />
            
//           </Routes>
//         </div>

//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";  // ✅ IMPORT
import CreateBill from "./pages/CreateBill";
import BillsList from "./pages/BillsList";
import ViewBill from "./pages/ViewBill";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <div className="w-64 bg-blue-600 text-white p-5">
          <h1 className="text-2xl font-bold mb-6">🚜 JCB Billing</h1>
          
          <nav className="flex flex-col gap-3">
            <Link to="/" className="hover:bg-blue-500 p-2 rounded">Dashboard</Link>
            <Link to="/create-bill" className="hover:bg-blue-500 p-2 rounded">Create Bill</Link>
            <Link to="/bills" className="hover:bg-blue-500 p-2 rounded">Bills</Link>
            <Link to="/customer-list" className="hover:bg-blue-500 p-2 rounded">Customer List</Link>
            <Link to="/settings" className="hover:bg-blue-500 p-2 rounded">Settings</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-bill" element={<CreateBill />} />
            <Route path="/bills" element={<BillsList />} />
            <Route path="/bills/:id" element={<ViewBill />} />
            <Route path="/customer-list" element={<CustomerList />} />  {/* ✅ ADD THIS */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;