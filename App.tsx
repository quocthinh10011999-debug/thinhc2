
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import Home from './pages/Home';
import Regulations from './pages/Regulations';
import Traditions from './pages/Traditions';
import Registration from './pages/Registration';
import FeedbackPage from './pages/Feedback';
import Login from './pages/Login';
import AccountManagement from './pages/AccountManagement';
import SystemSettings from './pages/SystemSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrations from './pages/AdminRegistrations';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/quy-dinh" element={<Layout><Regulations /></Layout>} />
              <Route path="/truyen-thong" element={<Layout><Traditions /></Layout>} />
              <Route path="/dang-ky" element={<Layout><Registration /></Layout>} />
              <Route path="/gop-y" element={<Layout><FeedbackPage /></Layout>} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes with Separate Layout */}
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/registrations" element={<AdminLayout><AdminRegistrations /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AccountManagement /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><SystemSettings /></AdminLayout>} />
              <Route path="/admin/database" element={<AdminLayout><div className="p-8 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Tính năng đang phát triển: Quản lý Sao lưu Database</div></AdminLayout>} />
            </Routes>
          </Router>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
