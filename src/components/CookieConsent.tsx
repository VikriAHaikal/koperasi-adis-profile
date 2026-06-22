import React, { useState, useEffect } from 'react';
import { Shield, X, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('koperasi_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('koperasi_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div className="cookie-icon-wrapper">
          <Shield size={20} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h5 className="cookie-title">
            Persetujuan Cache & Cookie
          </h5>
          <p className="cookie-desc">
            Website ini menggunakan penyimpanan lokal (*LocalStorage*) dan cache browser untuk menyimpan sesi masuk pengurus, data simulasi kalkulator syariah, serta mengoptimalkan performa halaman.
          </p>
        </div>
        <button 
          onClick={handleDecline} 
          className="cookie-close-btn"
          title="Tutup"
        >
          <X size={16} />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
        <button 
          onClick={handleDecline} 
          className="btn cookie-btn-decline"
        >
          Tolak
        </button>
        <button 
          onClick={handleAccept} 
          className="btn btn-primary cookie-btn-accept"
        >
          <Check size={12} />
          <span>Setuju & Izinkan</span>
        </button>
      </div>
    </div>
  );
};
