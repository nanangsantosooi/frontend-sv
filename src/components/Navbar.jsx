import React from 'react';
import { Newspaper, FileText, PlusCircle, Eye, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, counts }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveView('posts')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Newspaper size={20} />
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
            <FileText size={18} />
            <span>All Posts</span>
          </button>

          <button
            id="nav-add-new"
            className={`nav-item ${activeView === 'add' ? 'active' : ''}`}
            onClick={() => setActiveView('add')}
          >
            <PlusCircle size={18} />
            <span>Add New</span>
          </button>

          <button
            id="nav-preview"
            className={`nav-item ${activeView === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveView('preview')}
          >
            <Eye size={18} />
            <span>Preview</span>
          </button>
        </div>

        <div className="server-status" title="Golang API Server Running on port 8080">
          <div className="status-dot"></div>
          <span>API Connected</span>
        </div>
      </div>
    </nav>
  );
}
