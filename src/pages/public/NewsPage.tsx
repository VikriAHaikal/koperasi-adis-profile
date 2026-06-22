import React, { useState } from 'react';
import type { NewsArticle } from '../../services/db';
import { Calendar, User, ArrowRight, X, Search, Tag, Newspaper } from 'lucide-react';
import { SEO } from '../../components/SEO';

interface NewsPageProps {
  news: NewsArticle[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ news }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Categories list
  const categories = ['Semua', 'Pengumuman', 'Kegiatan', 'Promo', 'Edukasi'];

  // Category label mapped for public display
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Pengumuman': return '📢 Pengumuman';
      case 'Kegiatan': return '🤝 Kegiatan Koperasi';
      case 'Promo': return '🏷️ Promo Adis Mart';
      case 'Edukasi': return '💡 Edukasi & Keuangan';
      default: return cat;
    }
  };

  // Filter articles
  const filteredNews = news.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'Semua' || 
      (article.category || 'Pengumuman') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract Headline (first filtered item) and Grid (rest of the items)
  const headline = filteredNews.length > 0 ? filteredNews[0] : null;
  const gridArticles = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  // Category Badge Style mapping
  const getBadgeStyle = (category?: string) => {
    const cat = category || 'Pengumuman';
    switch (cat) {
      case 'Pengumuman':
        return { bg: '#fee2e2', text: '#ef4444', border: '#fca5a5' };
      case 'Kegiatan':
        return { bg: '#dbeafe', text: '#3b82f6', border: '#93c5fd' };
      case 'Promo':
        return { bg: '#d1fae5', text: '#10b981', border: '#6ee7b7' };
      case 'Edukasi':
        return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' };
      default:
        return { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '75px', backgroundColor: 'var(--light-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      <SEO 
        title="Berita & Agenda Kegiatan" 
        description="Ikuti perkembangan terbaru, pengumuman resmi, agenda kegiatan, promo Adis Mart, dan artikel edukasi dari Koperasi Karyawan PT Adis Dimension Footwear (KOPKAR ADIS)."
        canonicalPath="/berita"
      />

      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-orb-1" />
        <div className="page-header-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-header-title">Berita & Agenda Kegiatan</h1>
          <p className="page-header-subtitle">
            Ikuti pengumuman resmi, laporan kegiatan, informasi promo Adis Mart, serta edukasi finansial terpercaya dari Kopkar Adis.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* Filters and Search Bar Container */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Row 1: Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Cari artikel berita, pengumuman, atau promo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 50px',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                fontSize: '1rem',
                backgroundColor: '#f8fafc',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 98, 254, 0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <Search 
              size={20} 
              color="var(--text-muted-dark)" 
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} 
            />
          </div>

          {/* Row 2: Category Tabs Selector */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            alignItems: 'center',
            overflowX: 'auto',
            paddingBottom: '5px'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted-dark)', marginRight: '10px', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Tag size={14} /> Saring Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-light)',
                  backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--text-dark)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(15, 98, 254, 0.2)' : 'none'
                }}
                className="category-tab-btn"
              >
                {cat === 'Semua' ? '📂 Semua Berita' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* 1. HEADLINE ARTICLE (Peta Berita Utama) */}
        {headline && !searchQuery && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '18px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Newspaper size={20} color="var(--primary)" /> Artikel Terpopuler & Terbaru
            </h2>
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s'
              }}
              className="headline-card"
              onClick={() => setSelectedArticle(headline)}
            >
              {/* Image Column */}
              <div style={{ height: '350px', overflow: 'hidden', position: 'relative' }} className="headline-img-container">
                <img 
                  src={headline.image_url} 
                  alt={headline.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                />
                
                {/* Float Category Badge */}
                {(() => {
                  const style = getBadgeStyle(headline.category);
                  return (
                    <span style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      backgroundColor: style.bg,
                      color: style.text,
                      border: `1px solid ${style.border}`,
                      padding: '6px 14px',
                      borderRadius: '30px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      zIndex: 2,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {getCategoryLabel(headline.category || 'Pengumuman')}
                    </span>
                  );
                })()}
              </div>

              {/* Text Info Column */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {formatDate(headline.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    {headline.author}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', lineHeight: 1.25, margin: 0 }}>
                  {headline.title}
                </h3>
                
                <p style={{ fontSize: '0.96rem', color: 'var(--text-muted-dark)', lineHeight: 1.6, margin: 0 }}>
                  {headline.excerpt}
                </p>

                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginTop: '10px' }}>
                  Baca Selengkapnya <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. NEWS GRID LIST */}
        <div>
          {filteredNews.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: 'var(--text-muted-dark)',
              backgroundColor: 'white',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              Tidak ada berita atau pengumuman yang sesuai dalam kategori ini.
            </div>
          ) : (
            <div>
              {/* Grid Header */}
              {headline && !searchQuery && (
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
                  Artikel Lainnya
                </h2>
              )}

              {/* Grid listing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                
                {/* Render headline also if search query active, otherwise render only gridArticles */}
                {(searchQuery ? filteredNews : gridArticles).map((article) => {
                  const style = getBadgeStyle(article.category);
                  return (
                    <div 
                      key={article.id} 
                      className="branch-card" 
                      style={{ 
                        backgroundColor: 'white', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-md)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onClick={() => setSelectedArticle(article)}
                    >
                      {/* Thumbnail Container */}
                      <div className="branch-img-container" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={article.image_url} 
                          alt={article.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        
                        {/* Float Badge */}
                        <span style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          backgroundColor: style.bg,
                          color: style.text,
                          border: `1px solid ${style.border}`,
                          padding: '5px 12px',
                          borderRadius: '30px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          zIndex: 2,
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          {getCategoryLabel(article.category || 'Pengumuman')}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
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

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.3, margin: 0, fontFamily: 'var(--font-heading)' }} className="news-excerpt">
                          {article.title}
                        </h3>
                        
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted-dark)', margin: 0, lineHeight: 1.5, flexGrow: 1 }} className="news-excerpt">
                          {article.excerpt}
                        </p>
                        
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '5px' }}>
                          Baca Selengkapnya <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reader Modal Popup */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="news-modal-content" 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-2xl)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={e => e.stopPropagation()}
          >
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'transform 0.25s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              <X size={20} color="var(--dark-bg)" />
            </button>

            {/* Modal Body Container with Scroll */}
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              {/* Banner Image */}
              <div style={{ height: '300px', position: 'relative' }}>
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

              {/* Content Details */}
              <div style={{ padding: '35px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  {/* Category Badge */}
                  {(() => {
                    const style = getBadgeStyle(selectedArticle.category);
                    return (
                      <span style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        border: `1px solid ${style.border}`,
                        padding: '4px 12px',
                        borderRadius: '30px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}>
                        {getCategoryLabel(selectedArticle.category || 'Pengumuman')}
                      </span>
                    );
                  })()}
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.82rem', color: 'var(--text-muted-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {formatDate(selectedArticle.created_at)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {selectedArticle.author}
                    </span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '20px', lineHeight: 1.25, fontFamily: 'var(--font-heading)' }}>
                  {selectedArticle.title}
                </h2>

                <div 
                  style={{ 
                    fontSize: '1.05rem', 
                    color: 'var(--text-muted-dark)', 
                    lineHeight: 1.8, 
                    textAlign: 'justify' 
                  }}
                  className="news-rich-content"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global component styles */}
      <style>{`
        .news-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category-tab-btn:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          background-color: rgba(15, 98, 254, 0.05) !important;
        }
        .headline-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-2xl) !important;
        }
        .headline-card:hover .headline-img-container img {
          transform: scale(1.04);
        }
        .branch-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg) !important;
        }
        .branch-img-container img {
          transition: transform 0.4s ease;
        }
        .branch-card:hover .branch-img-container img {
          transform: scale(1.05);
        }
        
        /* Premium Rich Content Article Styles */
        .news-rich-content h2 {
          font-size: 1.45rem;
          font-weight: 800;
          margin-top: 28px;
          margin-bottom: 12px;
          color: var(--text-dark);
          font-family: var(--font-heading);
          line-height: 1.3;
        }
        .news-rich-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 22px;
          margin-bottom: 10px;
          color: var(--text-dark);
          font-family: var(--font-heading);
          line-height: 1.35;
        }
        .news-rich-content p {
          margin-bottom: 16px;
          line-height: 1.75;
          color: #334155;
          font-size: 1rem;
        }
        .news-rich-content ul, .news-rich-content ol {
          padding-left: 24px;
          margin-bottom: 18px;
          color: #334155;
        }
        .news-rich-content li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .news-rich-content a {
          color: var(--primary);
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        .news-rich-content a:hover {
          color: var(--primary-hover);
        }
        .news-rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px auto;
          display: block;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-light);
        }
        .news-rich-content blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 16px;
          font-style: italic;
          margin: 20px 0;
          color: var(--text-muted-dark);
        }

        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
