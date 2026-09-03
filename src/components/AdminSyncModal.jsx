import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, Key } from 'lucide-react';

export function AdminSyncModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_gh_token') || '';
    if (savedToken) setGithubToken(savedToken);
  }, []);

  if (!isOpen) return null;

  const handleTriggerSync = async (e) => {
    e.preventDefault();

    if (password !== 'yilmazlar2026') {
      setStatus('error');
      setMessage('Geçersiz yönetici şifresi.');
      return;
    }

    setStatus('loading');
    setMessage('GitHub Actions bulut sunucusu tetikleniyor...');

    try {
      // Save token locally for future clicks
      if (githubToken) {
        localStorage.setItem('admin_gh_token', githubToken.trim());
      }

      // First try via /api/trigger-sync (Vercel Serverless)
      let apiSuccess = false;
      try {
        const res = await fetch('/api/trigger-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, token: githubToken })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          apiSuccess = true;
        } else if (res.status === 400 || res.status === 401) {
          throw new Error(data.error || 'Yetkilendirme hatası');
        }
      } catch (apiErr) {
        // Fallback: If not on Vercel or /api route not deployed yet, trigger GitHub REST API directly if token is provided
        if (githubToken) {
          const directRes = await fetch('https://api.github.com/repos/rulingghost/yilmazlarmobilya/actions/workflows/catalog-sync.yml/dispatches', {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `Bearer ${githubToken.trim()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ref: 'main' })
          });

          if (directRes.status === 204 || directRes.ok) {
            apiSuccess = true;
          } else {
            const errTxt = await directRes.text();
            throw new Error(`GitHub API Doğrudan Çağrı Hatası (${directRes.status}): ${errTxt}`);
          }
        } else {
          throw apiErr;
        }
      }

      if (apiSuccess) {
        setStatus('success');
        setMessage('Senkronizasyon bulut üzerinde başarıyla başlatıldı! İstikbal taranıyor, yaklaşık 1-2 dakika içinde Vercel sitenizi güncelleyecektir.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="admin-modal-close" aria-label="Kapat">
          <X size={20} />
        </button>

        <div className="admin-modal-header">
          <div className="admin-modal-icon-bubble">
            <Lock size={24} className="text-wood" />
          </div>
          <h3 className="admin-modal-title">İstikbal Canlı Fiyat Güncelleme</h3>
          <p className="admin-modal-subtitle">
            Bulut sunucusu (GitHub Actions) İstikbal'deki 446 ürünü canlı tarar ve fiyatları otomatik günceller.
          </p>
        </div>

        <form onSubmit={handleTriggerSync} className="admin-modal-form">
          <div className="form-group">
            <label className="form-label">
              Yönetici Şifresi
            </label>
            <input
              type="password"
              placeholder="Yönetici şifrenizi girin..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>GitHub Erişim Anahtarı (Token)</span>
              <span className="token-optional">(İsteğe Bağlı / Otomatik Kaydedilir)</span>
            </label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input
                type="password"
                placeholder="ghp_... (GitHub Personal Access Token)"
                value={githubToken}
                onChange={e => setGithubToken(e.target.value)}
                className="form-input with-icon"
              />
            </div>
            <span className="form-hint">
              Tarayıcınızda hatırlanır. Vercel ortamında tanımlıysa boş bırakabilirsiniz.
            </span>
          </div>

          {status === 'loading' && (
            <div className="alert-box alert-loading">
              <RefreshCw size={18} className="animate-spin" />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="alert-box alert-success">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <div>
                <p>{message}</p>
                <div className="modal-links-row">
                  <a
                    href="https://github.com/rulingghost/yilmazlarmobilya/actions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-action-link"
                  >
                    <span>GitHub Actions'ta Canlı İzle</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-action-link"
                  >
                    <span>Vercel Deployments</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="alert-box alert-error">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div className="admin-modal-actions">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-submit-sync"
            >
              {status === 'loading' ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Başlatılıyor...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Şimdi Canlı Senkronize Et</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1rem;
        }
        .admin-modal-card {
          background: #FFF;
          border-radius: var(--radius-md, 12px);
          max-width: 480px;
          width: 100%;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
          position: relative;
          animation: modalPop 0.2s ease-out;
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .admin-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .admin-modal-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }
        .admin-modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .admin-modal-icon-bubble {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FAF5F0;
          color: #8C5A3C;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem auto;
          border: 1px solid rgba(140, 90, 60, 0.15);
        }
        .admin-modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.4rem 0;
        }
        .admin-modal-subtitle {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.45;
          margin: 0;
        }
        .admin-modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .token-optional {
          font-size: 0.72rem;
          color: #94A3B8;
          font-weight: 500;
        }
        .form-input {
          padding: 0.75rem 1rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.15s ease;
        }
        .form-input:focus {
          border-color: #8C5A3C;
          box-shadow: 0 0 0 3px rgba(140, 90, 60, 0.12);
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
        }
        .form-input.with-icon {
          width: 100%;
          padding-left: 2.3rem;
        }
        .form-hint {
          font-size: 0.73rem;
          color: #94A3B8;
          line-height: 1.35;
        }
        .alert-box {
          padding: 0.85rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          line-height: 1.4;
        }
        .alert-loading {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }
        .alert-success {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }
        .alert-error {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }
        .modal-links-row {
          display: flex;
          gap: 1rem;
          margin-top: 0.65rem;
        }
        .modal-action-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 700;
          font-size: 0.78rem;
          color: #047857;
          text-decoration: underline;
        }
        .modal-action-link:hover {
          color: #064E3B;
        }
        .btn-submit-sync {
          width: 100%;
          padding: 0.9rem;
          background: #8C5A3C;
          color: #FFF;
          font-weight: 800;
          font-size: 0.95rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(140, 90, 60, 0.25);
        }
        .btn-submit-sync:hover:not(:disabled) {
          background: #73462C;
          transform: translateY(-1px);
        }
        .btn-submit-sync:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
