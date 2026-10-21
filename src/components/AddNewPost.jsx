import React, { useState } from 'react';
import { Send, FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import articleApi from '../api/articleApi';

export default function AddNewPost({ onCancel, onSuccess, showToast }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const titleTrimmed = formData.title.trim();
    const contentTrimmed = formData.content.trim();
    const categoryTrimmed = formData.category.trim();

    if (!titleTrimmed) {
      errs.title = 'Title wajib diisi';
    } else if (titleTrimmed.length < 20) {
      errs.title = `Title minimal 20 karakter (saat ini: ${titleTrimmed.length} karakter)`;
    }

    if (!contentTrimmed) {
      errs.content = 'Content wajib diisi';
    } else if (contentTrimmed.length < 200) {
      errs.content = `Content minimal 200 karakter (saat ini: ${contentTrimmed.length} karakter)`;
    }

    if (!categoryTrimmed) {
      errs.category = 'Category wajib diisi';
    } else if (categoryTrimmed.length < 3) {
      errs.category = `Category minimal 3 karakter (saat ini: ${categoryTrimmed.length} karakter)`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (statusTarget) => {
    if (!validate()) {
      showToast('Harap periksa kelengkapan form sesuai ketentuan karakter minimal', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category.trim(),
        status: statusTarget, // 'publish' or 'draft'
      };

      await articleApi.createArticle(payload);
      showToast(`Artikel berhasil disimpan dengan status "${statusTarget.toUpperCase()}"`, 'success');
      onSuccess();
    } catch (err) {
      const serverErr = err.response?.data?.error || err.message;
      showToast('Gagal menyimpan artikel: ' + serverErr, 'error');
    } finally {
      setLoading(false);
    }
  };

  const titleLength = formData.title.trim().length;
  const contentLength = formData.content.trim().length;
  const categoryLength = formData.category.trim().length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Article</h1>
          <p className="page-subtitle">Tulis dan terbitkan artikel baru ke dalam sistem</p>
        </div>

        <button className="btn btn-secondary" onClick={onCancel}>
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
      </div>

      <div className="card form-card">
        {/* Title Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="post-title">
            Title <span className="form-label-hint">(Minimal 20 Karakter)</span>
          </label>
          <input
            id="post-title"
            type="text"
            className="form-input"
            placeholder="Masukkan judul artikel yang menarik dan deskriptif..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className={`char-counter ${titleLength >= 20 ? 'valid' : 'invalid'}`}>
            {titleLength >= 20 ? <CheckCircle2 size={12} style={{ marginRight: 4 }} /> : null}
            {titleLength} / 20 Karakter
          </div>
          {errors.title && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.title}</div>}
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="post-category">
            Category <span className="form-label-hint">(Minimal 3 Karakter)</span>
          </label>
          <input
            id="post-category"
            type="text"
            className="form-input"
            placeholder="Contoh: Technology, Artificial Intelligence, Business..."
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <div className={`char-counter ${categoryLength >= 3 ? 'valid' : 'invalid'}`}>
            {categoryLength >= 3 ? <CheckCircle2 size={12} style={{ marginRight: 4 }} /> : null}
            {categoryLength} / 3 Karakter
          </div>
          {errors.category && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.category}</div>}
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="post-content">
            Content <span className="form-label-hint">(Minimal 200 Karakter)</span>
          </label>
          <textarea
            id="post-content"
            className="form-textarea"
            placeholder="Tuliskan isi artikel Anda secara komprehensif di sini..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <div className={`char-counter ${contentLength >= 200 ? 'valid' : 'invalid'}`}>
            {contentLength >= 200 ? <CheckCircle2 size={12} style={{ marginRight: 4 }} /> : null}
            {contentLength} / 200 Karakter
          </div>
          {errors.content && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.content}</div>}
        </div>

        {/* Action Buttons: "Publish" dan "Draft" */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="button"
            id="btn-draft"
            className="btn btn-draft"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            <FileText size={16} />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            id="btn-publish"
            className="btn btn-primary"
            onClick={() => handleSubmit('publish')}
            disabled={loading}
          >
            <Send size={16} />
            <span>Publish Artikel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
