import React from 'react';
import { Link } from 'react-router-dom';
import type { BusinessUnit } from '../../services/db';
import * as Icons from 'lucide-react';
import { SEO } from '../../components/SEO';

interface BusinessUnitsPageProps {
  units: BusinessUnit[];
}

export const BusinessUnitsPage: React.FC<BusinessUnitsPageProps> = ({ units }) => {
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={30} color="var(--primary)" />;
    }
    return <Icons.Award size={30} color="var(--primary)" />;
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '70px' }}>
      <SEO 
        title="Unit Usaha" 
        description="Layanan unit usaha Koperasi Adis: Adis Mart, Unit Simpan Pinjam Syariah, dan Jasa Distribusi Logistik. Pelajari detail setiap unit usaha kami." 
      />
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-orb-1" />
        <div className="page-header-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-header-title">Unit Usaha Koperasi</h1>
          <p className="page-header-subtitle">
            Layanan harian, logistik, dan program kesejahteraan finansial bagi seluruh anggota Kopkar Adis.
          </p>
        </div>
      </section>

      {/* Business Units Detail Grid */}
      <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {units.map((unit, index) => (
              <div 
                key={unit.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                  gap: '40px', 
                  padding: '40px',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {/* Image half */}
                {unit.image_url && (
                  <div style={{ flex: '1 1 400px', borderRadius: '16px', overflow: 'hidden', height: 'auto', aspectRatio: '16 / 10', boxShadow: 'var(--shadow-md)' }}>
                    <img 
                      src={unit.image_url} 
                      alt={unit.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Details half */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: 'rgba(15, 98, 254, 0.1)',
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {renderIcon(unit.icon)}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                      {unit.name}
                    </h2>
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', lineHeight: 1.7 }}>
                    {unit.description}
                  </p>
                  
                  {unit.id === 'unit-2' && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '6px 12px', borderRadius: '50px' }}>
                        Jasa Flat 1%
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, backgroundColor: 'rgba(15, 98, 254, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '50px' }}>
                        Tanpa Riba / Syariah
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: '15px' }}>
                    <Link 
                      to={`/unit-usaha/${unit.id}`} 
                      className="btn btn-primary" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '12px 24px', 
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.92rem'
                      }}
                    >
                      <span>Buka Detail Unit</span>
                      <Icons.ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Grid System CSS override for this page */}
      <style>{`
        @media (max-width: 768px) {
          .glass-card {
            flex-direction: column !important;
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};
