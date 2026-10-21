import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, ArrowRight, X } from 'lucide-react';
import articleApi from '../api/articleApi';

export default function PreviewBlog({ showToast }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 6; // 6 articles per page for grid
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchPublishedArticles = async (currentPage) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      // Fetch 1 extra to check if there is a next page
      const data = await articleApi.getArticlesPaged(limit + 1, offset, 'publish');
      
      if (data && data.length > limit) {
        setHasNextPage(true);
        setArticles(data.slice(0, limit));
      } else {
        setHasNextPage(false);
        setArticles(data || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat artikel blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedArticles(page);
  }, [page]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog Preview</h1>
          <p className="page-subtitle">Tampilan artikel publik yang telah berstatus <strong>Published</strong></p>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Memuat artikel blog...
        </div>
      ) : articles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <BookOpen className="empty-icon" />
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Belum Ada Artikel yang Dipublish</h3>
            <p>Silakan buat atau ubah status artikel menjadi <strong>Publish</strong> untuk melihatnya di sini.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {articles.map((article) => (
              <div
                key={article.id}
                className="blog-card"
                onClick={() => setSelectedArticle(article)}
              >
                <div>
                  <div className="blog-meta">
                    <span className="category-tag">{article.category}</span>
                    <span className="blog-date">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {formatDate(article.created_date)}
                    </span>
                  </div>

                  <h3 className="blog-title">{article.title}</h3>
                  <p className="blog-excerpt">{article.content}</p>
                </div>

                <div className="blog-read-more">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              id="pagination-prev"
              className="pagination-btn"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} style={{ marginRight: 4 }} />
              Sebelumnya
            </button>

            <span className="pagination-info">Halaman {page}</span>

            <button
              id="pagination-next"
              className="pagination-btn"
              disabled={!hasNextPage || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Selanjutnya
              <ChevronRight size={16} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </>
      )}

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="category-tag" style={{ marginBottom: '0.5rem' }}>
                  {selectedArticle.category}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
                  {selectedArticle.title}
                </h2>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Dipublikasikan pada {formatDate(selectedArticle.created_date)}
                </div>
              </div>

              <button
                className="icon-btn"
                onClick={() => setSelectedArticle(null)}
                style={{ flexShrink: 0 }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ whiteSpace: 'pre-line' }}>{selectedArticle.content}</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
