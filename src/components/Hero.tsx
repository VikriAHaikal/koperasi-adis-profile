import React, { useState, useEffect } from 'react';
import type { HeroSlide } from '../services/db';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  slides: HeroSlide[];
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ slides, onCtaClick }) => {
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
    <section id="hero" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url(${slide.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentIndex ? 1 : 0,
            transform: index === currentIndex ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 1s ease-in-out, transform 2s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Content Container */}
          <div className="container" style={{ textAlign: 'center', color: 'white', padding: '0 20px', zIndex: 10 }}>
            <h2 
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                marginBottom: '20px',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.15,
                transform: index === currentIndex ? 'translateY(0)' : 'translateY(30px)',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
              }}
            >
              {slide.title}
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '40px',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textShadow: '0 2px 6px rgba(0,0,0,0.5)',
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
              <button 
                onClick={onCtaClick} 
                className="btn btn-primary"
                style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '50px' }}
              >
                Gabung Menjadi Anggota
              </button>
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
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="hero-arrow hero-arrow-right"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicator dots */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 20,
          }}
        >
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
