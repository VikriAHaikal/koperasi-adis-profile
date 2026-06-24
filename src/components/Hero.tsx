import React, { useState, useEffect } from 'react';
import type { HeroSlide } from '../services/db';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  slides: HeroSlide[];
  onCtaClick: () => void;
  whatsappNumber?: string;
}

export const Hero: React.FC<HeroProps> = ({ slides, onCtaClick, whatsappNumber }) => {
  const waMessage = encodeURIComponent(
    'Hallo Admin Koperasi'
  );
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${waMessage}`
    : null;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section id="hero" className="hero-section">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="hero-slide"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url(${slide.image_url})`,
            opacity: index === currentIndex ? 1 : 0,
            transform: index === currentIndex ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 1s ease-in-out, transform 2s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          {/* Content Container */}
          <div className="container" style={{ textAlign: 'center', color: 'white', padding: '0 20px', zIndex: 10 }}>
            <h2 
              className="hero-title"
              style={{
                transform: index === currentIndex ? 'translateY(0)' : 'translateY(30px)',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
              }}
            >
              {slide.title}
            </h2>
            <p
              className="hero-subtitle"
              style={{
                transform: index === currentIndex ? 'translateY(0)' : 'translateY(30px)',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
              }}
            >
              {slide.subtitle}
            </p>
            <div
              style={{
                transform: index === currentIndex ? 'translateY(0)' : 'translateY(30px)',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s'
              }}
            >
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary hero-cta-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.278 7.042L.787 23.338a1 1 0 0 0 1.225 1.225l4.3-1.49A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.282 0-4.402-.761-6.109-2.033l-.426-.314-3.44 1.19 1.19-3.438-.314-.426A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Terhubung dengan Kami
                </a>
              ) : (
                <button
                  onClick={onCtaClick}
                  className="btn btn-primary hero-cta-btn"
                >
                  Terhubung dengan Kami
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hero-arrow hero-arrow-left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="hero-arrow hero-arrow-right"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicator dots */}
      {slides.length > 1 && (
        <div className="hero-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: idx === currentIndex ? 'var(--primary)' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
