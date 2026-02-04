
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import Home from './pages/Home';
import Regulations from './pages/Regulations';
import Traditions from './pages/Traditions';
import Registration from './pages/Registration';
import FeedbackPage from './pages/Feedback';
import QuizPortal from './pages/QuizPortal';
import Login from './pages/Login';
import AccountManagement from './pages/AccountManagement';
import SystemSettings from './pages/SystemSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrations from './pages/AdminRegistrations';
import AdminIdeology from './pages/AdminIdeology';
import AdminQuiz from './pages/AdminQuiz';
import { AuthProvider } from './context/AuthContext';
// Fix: Import ThemeProvider from ThemeContext.tsx instead of non-existent ThemeProvider.tsx
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { MusicProvider } from './context/MusicContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <MusicProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/quy-dinh" element={<Layout><Regulations /></Layout>} />
                <Route path="/truyen-thong" element={<Layout><Traditions /></Layout>} />
                <Route path="/dang-ky" element={<Layout><Registration /></Layout>} />
                <Route path="/gop-y" element={<Layout><FeedbackPage /></Layout>} />
                <Route path="/thi-nhan-thuc" element={<Layout><QuizPortal /></Layout>} />
                <Route path="/login" element={<Login />} />

                {/* Admin Routes with Separate Layout */}
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/registrations" element={<AdminLayout><AdminRegistrations /></AdminLayout>} />
                <Route path="/admin/ideology" element={<AdminLayout><AdminIdeology /></AdminLayout>} />
                <Route path="/admin/quiz" element={<AdminLayout><AdminQuiz /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><AccountManagement /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><SystemSettings /></AdminLayout>} />
              </Routes>
            </Router>
          </MusicProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
