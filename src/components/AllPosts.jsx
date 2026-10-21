import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, RotateCcw, AlertCircle, Search, RefreshCw } from 'lucide-react';
import articleApi from '../api/articleApi';

export default function AllPosts({ onEditArticle, showToast, refreshTrigger }) {
  const [activeTab, setActiveTab] = useState('publish'); // 'publish' | 'draft' | 'thrash'
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ publish: 0, draft: 0, thrash: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch articles and tab counts
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Fetch up to 100 items per tab
      const data = await articleApi.getArticlesPaged(100, 0, activeTab);
      setPosts(data || []);

      const stats = await articleApi.getStatsCounts();
      setCounts(stats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat artikel dari server backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [activeTab, refreshTrigger]);

  // Handle Trash icon click
  // "c. Jika klik icon thrash maka article akan pindah ke tab thrash."
  const handleTrashClick = async (post) => {
    if (activeTab === 'thrash') {
      // If already in Trashed tab, confirm permanent delete
      const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus permanen artikel "${post.title}"?`);
      if (!confirmDelete) return;

      try {
        await articleApi.deleteArticle(post.id);
        showToast('Artikel berhasil dihapus secara permanen', 'success');
        fetchArticles();
      } catch (err) {
        showToast('Gagal menghapus artikel: ' + (err.response?.data?.error || err.message), 'error');
      }
    } else {
      // Move to Trash: update status to 'thrash'
      try {
        await articleApi.moveToTrash(post.id, post);
        showToast(`Artikel "${post.title.substring(0, 30)}..." berhasil dipindahkan ke tab Thrash`, 'success');
        fetchArticles();
      } catch (err) {
        showToast('Gagal memindahkan artikel ke Thrash: ' + (err.response?.data?.error || err.message), 'error');
      }
    }
  };

  // Helper to restore from Trash
  const handleRestoreClick = async (post, targetStatus) => {
    try {
      await articleApi.restoreArticle(post.id, post, targetStatus);
      showToast(`Artikel berhasil dipulihkan ke status ${targetStatus}`, 'success');
      fetchArticles();
    } catch (err) {
      showToast('Gagal memulihkan artikel: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  // Filter posts by search query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Posts</h1>
          <p className="page-subtitle">Kelola seluruh artikel, status publikasi, dan draft artikel</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', width: '220px', height: '40px' }}
            />
          </div>

          <button className="icon-btn" onClick={fetchArticles} title="Refresh data">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs: Published, Drafts, Trashed */}
      <div className="tabs-container">
        <button
          id="tab-published"
          className={`tab-btn ${activeTab === 'publish' ? 'active' : ''}`}
          onClick={() => setActiveTab('publish')}
        >
          <span>Published</span>
          <span className="tab-badge">{counts.publish || 0}</span>
        </button>

        <button
          id="tab-drafts"
          className={`tab-btn ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          <span>Drafts</span>
          <span className="tab-badge">{counts.draft || 0}</span>
        </button>

        <button
          id="tab-trashed"
          className={`tab-btn ${activeTab === 'thrash' ? 'active' : ''}`}
          onClick={() => setActiveTab('thrash')}
        >
          <span>Trashed</span>
          <span className="tab-badge">{counts.thrash || 0}</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '55%' }}>Title</th>
                <th style={{ width: '25%' }}>Category</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Memuat data artikel...</div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    <div className="empty-state">
                      <AlertCircle className="empty-icon" />
                      <p>Tidak ada artikel di tab <strong>{activeTab.toUpperCase()}</strong></p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="post-title-cell">{post.title}</div>
                      <div className="post-excerpt">{post.content}</div>
                    </td>
                    <td>
                      <span className="category-tag">{post.category}</span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        {/* Icon Edit */}
                        <button
                          className="icon-btn edit"
                          title="Edit Artikel"
                          onClick={() => onEditArticle(post)}
                        >
                          <Edit3 size={17} />
                        </button>

                        {/* Icon Thrash */}
                        <button
                          className="icon-btn trash"
                          title={activeTab === 'thrash' ? 'Hapus Permanen' : 'Pindahkan ke Trash'}
                          onClick={() => handleTrashClick(post)}
                        >
                          <Trash2 size={17} />
                        </button>

                        {/* Restore Button (If on Thrash Tab) */}
                        {activeTab === 'thrash' && (
                          <button
                            className="icon-btn restore"
                            title="Pulihkan ke Publish"
                            onClick={() => handleRestoreClick(post, 'publish')}
                          >
                            <RotateCcw size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
