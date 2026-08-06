import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, registerUser, googleLogin } from '../services/authservice';
import Lottie from 'lottie-react';
import toolAnimation from '../assets/tool.json';
import '../app.css';

export default function Login({ setUser }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhoneNumber, setRegPhoneNumber] = useState('');

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

        const data = await loginUser({
          username: loginEmail,
          password: loginPassword
        });

        console.log('Login Success:', data);


        // Save token and user separately so API calls can find them
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));


        setUser(data.user);


      } else {

        const data = await registerUser({
          firstName: regFirstName,
          lastName: regLastName,
          phoneNumber: regPhoneNumber,
          username: regUsername,
          email: regEmail,
          password: regPassword
        });


        console.log('Registration Success:', data);


        setSuccessMessage(
          'Account created successfully! Please sign in.'
        );


        setActiveTab('login');

      }


    } catch (err) {

      setError(
        err.message || 'An error occurred. Please try again.'
      );

    }

  };


  return (
    <>

      <button id="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>


      <header className="brand-header">

        <div className="header-icon">

          <Lottie
            animationData={toolAnimation}
            loop={false}
            speed={0.5}
          />

        </div>


        <div className="brand-text">

          <h1>
            Enrique Auto Mechanic
          </h1>

          <p>
            Professional Repair & Diagnostic Services
          </p>

        </div>

      </header>



      <main>

        <div className="terminal-card">


          <div className="tab-buttons">

            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMessage('');
              }}
            >
              Login
            </button>


            <button
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setError('');
                setSuccessMessage('');
              }}
            >
              Register
            </button>


          </div>



          {error &&
            <p
              className="error-message"
              style={{
                color:'red',
                textAlign:'center',
                marginBottom:'10px'
              }}
            >
              {error}
            </p>
          }



          {successMessage &&
            <p
              className="success-message"
              style={{
                color:'green',
                textAlign:'center',
                marginBottom:'10px'
              }}
            >
              {successMessage}
            </p>
          }



          <div className="form-container">


            {activeTab === 'login' && (

              <div className="form-section active">

                <form onSubmit={(e)=>handleSubmit(e,'login')}>

                  <div className="input-group">

                    <label>
                      Username or Email
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Enter username or email"
                      value={loginEmail}
                      onChange={(e)=>setLoginEmail(e.target.value)}
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e)=>setLoginPassword(e.target.value)}
                    />

                  </div>


                  <button
                    type="submit"
                    className="action-btn"
                  >
                    Sign In
                  </button>


                </form>

              </div>

            )}




            {activeTab === 'register' && (

              <div className="form-section active">


                <form onSubmit={(e)=>handleSubmit(e,'register')}>



                  <div className="input-group">
                    <label>First Name</label>

                    <input
                      required
                      value={regFirstName}
                      onChange={(e)=>setRegFirstName(e.target.value)}
                    />
                  </div>



                  <div className="input-group">
                    <label>Last Name</label>

                    <input
                      required
                      value={regLastName}
                      onChange={(e)=>setRegLastName(e.target.value)}
                    />
                  </div>



                  <div className="input-group">
                    <label>Username</label>

                    <input
                      required
                      value={regUsername}
                      onChange={(e)=>setRegUsername(e.target.value)}
                    />
                  </div>



                  <div className="input-group">
                    <label>Email Address</label>

                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e)=>setRegEmail(e.target.value)}
                    />
                  </div>



                  <div className="input-group">
                    <label>Phone Number</label>

                    <input
                      type="tel"
                      required
                      value={regPhoneNumber}
                      onChange={(e)=>setRegPhoneNumber(e.target.value)}
                    />
                  </div>



                  <div className="input-group">
                    <label>Password</label>

                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e)=>setRegPassword(e.target.value)}
                    />
                  </div>



                  <button
                    type="submit"
                    className="action-btn"
                  >
                    Create Account
                  </button>



                </form>


              </div>

            )}


          </div>



          <div className="google-login-container">

            <GoogleLogin

              theme="outline"
              size="large"
              width="250"
              text="continue_with"


              onSuccess={async (credentialResponse)=>{

                try {

                  const data = await googleLogin(
                    credentialResponse.credential
                  );


                  console.log(
                    "Google Login Success:",
                    data
                  );


                 localStorage.setItem("token", data.token);
                 localStorage.setItem("user", JSON.stringify(data.user));


                  setUser(data.user);


                } catch(err){

                  setError(
                    err.message || "Google login failed"
                  );

                }

              }}


              onError={()=>{

                setError(
                  "Google Login Failed"
                );

              }}

            />

          </div>


        </div>

      </main>



      <footer>

        &copy; 2026 Enrique Mobile Mechanic. All rights reserved.

      </footer>


    </>
  );
}
