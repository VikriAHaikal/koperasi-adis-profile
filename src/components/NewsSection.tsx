import React, { useState } from 'react';
import type { NewsArticle } from '../services/db';
import { Calendar, User, ArrowRight, X } from 'lucide-react';

interface NewsSectionProps {
  news: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (!news || news.length === 0) return null;

  return (
    <section id="news" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Informasi Terkini</span>
          <h2 className="section-title">Berita & Kegiatan</h2>
        </div>

        <div className="grid-2">
          {news.map((article) => (
            <div 
              key={article.id} 
              className="glass-card news-card" 
              onClick={() => setSelectedArticle(article)}
            >
              {/* Thumbnail */}
              <div className="news-thumbnail">
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* Text info */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Meta details */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-muted-dark)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {formatDate(article.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} />
                    {article.author}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0 }} className="news-excerpt">
                  {article.excerpt}
                </p>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginTop: '5px' }}>
                  Baca Selengkapnya <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="news-modal-content">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              <X size={20} color="var(--dark-bg)" />
            </button>

            {/* Banner Image */}
            <div className="news-modal-banner">
              <img 
                src={selectedArticle.image_url} 
                alt={selectedArticle.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
              }} />
            </div>

            {/* Content Body */}
            <div className="news-modal-body" style={{ padding: '35px' }}>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted-dark)', marginBottom: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  {formatDate(selectedArticle.created_at)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  {selectedArticle.author}
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '20px', lineHeight: 1.25 }}>
                {selectedArticle.title}
              </h2>

              <div 
                style={{ 
                  fontSize: '1.05rem', 
                  color: 'var(--text-muted-dark)', 
                  lineHeight: 1.7, 
                  textAlign: 'justify' 
                }}
                className="news-rich-content"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .news-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </section>
  );
};
