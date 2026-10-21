import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AllPosts from './components/AllPosts';
import AddNewPost from './components/AddNewPost';
import EditPost from './components/EditPost';
import PreviewBlog from './components/PreviewBlog';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('posts'); // 'posts' | 'add' | 'edit' | 'preview'
  const [editingPost, setEditingPost] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Toast notification dispatcher
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleEditArticle = (post) => {
    setEditingPost(post);
    setActiveView('edit');
  };

  const handleActionSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveView('posts');
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          if (view !== 'edit') setEditingPost(null);
          setActiveView(view);
        }}
      />

      {/* Main View Router */}
      <main className="main-content">
        {activeView === 'posts' && (
          <AllPosts
            onEditArticle={handleEditArticle}
            showToast={showToast}
            refreshTrigger={refreshTrigger}
          />
        )}

        {activeView === 'add' && (
          <AddNewPost
            onCancel={() => setActiveView('posts')}
            onSuccess={handleActionSuccess}
            showToast={showToast}
          />
        )}

        {activeView === 'edit' && (
          <EditPost
            post={editingPost}
            onCancel={() => {
              setEditingPost(null);
              setActiveView('posts');
            }}
            onSuccess={handleActionSuccess}
            showToast={showToast}
          />
        )}

        {activeView === 'preview' && (
          <PreviewBlog showToast={showToast} />
        )}
      </main>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            )}
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
