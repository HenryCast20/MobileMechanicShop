import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, registerUser } from './authservice';
import Lottie from 'lottie-react';
import toolAnimation from './assets/tool.json';
import './app.css';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Form input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (formType === 'login') {
        const data = await loginUser({ email: loginEmail, password: loginPassword });
        console.log('Login Success:', data);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setSuccessMessage('Successfully logged in!');
      } else {
        const data = await registerUser({ name: regName, email: regEmail, password: regPassword });
        console.log('Registration Success:', data);
        setSuccessMessage('Account created successfully! Please sign in.');
        setActiveTab('login');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Theme Toggle Button */}
      <button id="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Banner */}
      <header className="brand-header">
        <div className="header-icon">
          <Lottie
            animationData={toolAnimation}
            loop={false}
            speed={0.5}
          />
        </div>
        <div className="brand-text">
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair & Diagnostic Services</p>
        </div>
      </header>

      {/* Center Terminal */}
      <main>
        <div className="terminal-card">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMessage(''); }}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('register'); setError(''); setSuccessMessage(''); }}
            >
              Register
            </button>
          </div>

          {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          {successMessage && <p className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{successMessage}</p>}

          <div className="form-container">
            {/* Login Form */}
            <div id="login-section" className={`form-section ${activeTab === 'login' ? 'active' : ''}`}>
              <form onSubmit={(e) => handleSubmit(e, 'login')}>
                <div className="input-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input 
                    type="email" 
                    id="login-email" 
                    required 
                    placeholder="name@example.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="login-password">Password</label>
                  <input 
                    type="password" 
                    id="login-password" 
                    required 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="action-btn">Sign In</button>
              </form>
            </div>

            {/* Register Form */}
            <div id="register-section" className={`form-section ${activeTab === 'register' ? 'active' : ''}`}>
              <form onSubmit={(e) => handleSubmit(e, 'register')}>
                <div className="input-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <input 
                    type="text" 
                    id="reg-name" 
                    required 
                    placeholder="John Doe" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <input 
                    type="email" 
                    id="reg-email" 
                    required 
                    placeholder="name@example.com" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="reg-password">Create Password</label>
                  <input 
                    type="password" 
                    id="reg-password" 
                    required 
                    placeholder="••••••••" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="action-btn">Create Account</button>
              </form>
            </div>
          </div>

          <div className="google-login-container">
            <GoogleLogin
              theme="outline"
              size="large"
              width="250"
              text="continue_with"
              onSuccess={(credentialResponse) => {
                console.log("Google Login Success:", credentialResponse);
              }}
              onError={() => {
                console.log("Google Login Failed");
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        &copy; 2026 Enrique Mobile Mechanic. All rights reserved.
      </footer>
    </>
  );
}
