import React from 'react';
import type { BusinessUnit } from '../services/db';
import * as Icons from 'lucide-react';

interface BusinessUnitsProps {
  units: BusinessUnit[];
}

export const BusinessUnits: React.FC<BusinessUnitsProps> = ({ units }) => {
  // Helper to render Lucide icons dynamically from string name
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={28} color="var(--primary)" />;
    }
    return <Icons.Award size={28} color="var(--primary)" />; // Fallback icon
  };

  if (!units || units.length === 0) return null;

  return (
    <section id="units" className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Fasilitas Anggota</span>
          <h2 className="section-title">Unit Usaha Kami</h2>
        </div>

        <div className="grid-3">
          {units.map((unit) => (
            <div key={unit.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px', overflow: 'hidden' }}>
              {/* Unit Cover Image */}
              {unit.image_url && (
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={unit.image_url}
                    alt={unit.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                    className="unit-img"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    {renderIcon(unit.icon)}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-dark)' }}>
                  {unit.name}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '20px', flexGrow: 1 }}>
                  {unit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .glass-card:hover .unit-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};
