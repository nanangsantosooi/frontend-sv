import React, { useState, useEffect } from 'react';
import { Newspaper, FileText, PlusCircle, Eye } from 'lucide-react';
import articleApi from '../api/articleApi';

export default function Navbar({ activeView, setActiveView }) {
  const [isBackendOnline, setIsBackendOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const verifyConnection = async () => {
      const online = await articleApi.checkHealth();
      if (isMounted) {
        setIsBackendOnline(online);
      }
    };
    verifyConnection();

    // Check periodically
    const interval = setInterval(verifyConnection, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveView('posts')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Newspaper size={18} />
          </div>
          <span>Sharing Vision</span>
          <span className="brand-badge">CMS</span>
        </div>

        <div className="nav-links">
          <button
            id="nav-all-posts"
            className={`nav-item ${activeView === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveView('posts')}
          >
            <FileText size={17} />
            <span>All Posts</span>
          </button>

          <button
            id="nav-add-new"
            className={`nav-item ${activeView === 'add' ? 'active' : ''}`}
            onClick={() => setActiveView('add')}
          >
            <PlusCircle size={17} />
            <span>Add New</span>
          </button>

          <button
            id="nav-preview"
            className={`nav-item ${activeView === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveView('preview')}
          >
            <Eye size={17} />
            <span>Preview</span>
          </button>
        </div>

        {/* Dynamic Status Indicator */}
        <div
          className="server-status"
          title={
            isBackendOnline
              ? 'Terhubung langsung ke REST API Golang (Port 8080)'
              : 'Berjalan dalam mode Demo Browser Storage (Bisa CRUD & Tabulasi secara mandiri)'
          }
        >
          <div
            className="status-dot"
            style={{
              background: isBackendOnline ? 'var(--black)' : 'var(--text-light)',
            }}
          ></div>
          <span>{isBackendOnline ? 'API Connected' : 'Demo Mode (Active)'}</span>
        </div>
      </div>
    </nav>
  );
}
