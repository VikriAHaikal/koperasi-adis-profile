import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';
import { LogIn, Home, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (userSession: any) => void;
  onGoHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onGoHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = localStorage.getItem('admin_failed_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('admin_lockout_time');
    return saved ? parseInt(saved, 10) : null;
  });

  const updateFailedAttempts = (val: number) => {
    setFailedAttempts(val);
    localStorage.setItem('admin_failed_attempts', val.toString());
  };

  const updateLockoutTime = (val: number | null) => {
    setLockoutTime(val);
    if (val === null) {
      localStorage.removeItem('admin_lockout_time');
    } else {
      localStorage.setItem('admin_lockout_time', val.toString());
    }
  };

  useEffect(() => {
    if (!lockoutTime) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockoutTime) {
        updateLockoutTime(null);
        setError('');
      } else {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        setError(`Terlalu banyak percobaan masuk gagal. Login dikunci selama ${remaining} detik.`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if currently locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Terlalu banyak percobaan masuk gagal. Login dikunci selama ${remaining} detik.`);
      return;
    }

    setError('');
    setLoading(true);

    const handleFailure = (errMessage: string) => {
      setError(errMessage);
      const next = failedAttempts + 1;
      if (next >= 5) {
        const newLockout = Date.now() + 60 * 1000; // 60 seconds lockout
        updateLockoutTime(newLockout);
        updateFailedAttempts(0);
        setError('Terlalu banyak percobaan masuk gagal. Login dikunci sementara selama 60 detik.');
      } else {
        updateFailedAttempts(next);
      }
    };

    if (!isSupabaseConfigured) {
      // Demo Mode Authentication
      setTimeout(() => {
        const storedEmail = localStorage.getItem('demo_admin_email') || 'admin@kopkaradis.com';
        const storedPassword = localStorage.getItem('demo_admin_password') || 'admin';
        if (email === storedEmail && password === storedPassword) {
          updateFailedAttempts(0);
          updateLockoutTime(null);
          onLoginSuccess({ user: { email, role: 'admin' }, isDemo: true });
        } else {
          handleFailure('Email atau password salah.');
        }
        setLoading(false);
      }, 1000);
    } else {
      // Real Supabase Auth
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            handleFailure(error.message);
          } else if (data && data.session) {
            updateFailedAttempts(0);
            updateLockoutTime(null);
            const enhancedSession = {
              ...data.session,
              user: {
                ...data.session.user,
                role: 'admin' // all logged in users are administrators
              }
            };
            onLoginSuccess(enhancedSession);
          }
        }
      } catch (err: any) {
        handleFailure(err.message || 'Terjadi kesalahan sistem saat mencoba login.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--dark-bg)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(15, 98, 254, 0.05) 0%, transparent 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 40px) scale(1.1); }
          100% { transform: translate(-30px, 70px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-70px, -50px) scale(0.9); }
          100% { transform: translate(40px, -80px) scale(1.12); }
        }
        .login-input {
          background-color: rgba(15, 23, 42, 0.4) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          transition: all 0.3s ease !important;
        }
        .login-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 4px rgba(15, 98, 254, 0.2) !important;
          background-color: rgba(15, 23, 42, 0.75) !important;
        }
        .autofill-btn:hover {
          background-color: rgba(16, 185, 129, 0.15) !important;
          border-color: var(--accent) !important;
          color: white !important;
          transform: translateY(-1px);
        }
        .autofill-btn:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Floating Animated Orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 98, 254, 0.1) 0%, rgba(0,0,0,0) 70%)',
          top: '15%',
          left: '10%',
          animation: 'floatOrb1 18s infinite alternate ease-in-out'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)',
          bottom: '15%',
          right: '8%',
          animation: 'floatOrb2 22s infinite alternate ease-in-out'
        }} />
      </div>

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
        color: 'white',
        padding: '40px 30px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Back Home Button */}
        <button 
          onClick={onGoHome}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted-light)'}
        >
          <Home size={14} />
          <span>Kembali</span>
        </button>

        {/* Lock Icon header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 8px 20px rgba(15, 98, 254, 0.3)'
        }}>
          <LogIn size={26} color="white" />
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>
          ADMIN PORTAL
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-light)', marginBottom: '30px', lineHeight: 1.4 }}>
          Silakan masuk untuk mengelola konten website Company Profile.
        </p>

        {/* Info Box for Demo Mode */}


        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', textAlign: 'left', lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" htmlFor="email" style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 600 }}>Email Pengurus</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input login-input"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative', marginBottom: '22px' }}>
            <label className="form-label" htmlFor="password" style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input login-input"
              style={{ paddingRight: '45px' }}
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                bottom: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading || (lockoutTime !== null && Date.now() < lockoutTime)}
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.9rem'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-mini" style={{ width: '15px', height: '15px', borderWidth: '2px' }}></span>
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
