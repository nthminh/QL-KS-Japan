import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import EngineerList from './components/EngineerList';
import InvoiceList from './components/InvoiceList';
import CompanyList from './components/CompanyList';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('engineers');

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      alert('Lỗi khi đăng xuất: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>QL-E-Japan</h1>
          <div className="header-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="btn-signout">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'engineers' ? 'active' : ''}`}
          onClick={() => setActiveTab('engineers')}
        >
          Kỹ sư & Tu nghiệp sinh
        </button>
        <button
          className={`nav-button ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Công ty
        </button>
        <button
          className={`nav-button ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Hóa đơn
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'engineers' && <EngineerList />}
        {activeTab === 'companies' && <CompanyList />}
        {activeTab === 'invoices' && <InvoiceList />}
      </main>

      <footer className="app-footer">
        <p>© 2025 QL-E-Japan - Quản lý hóa đơn và kỹ sư</p>
      </footer>
    </div>
  );
}

export default App;
