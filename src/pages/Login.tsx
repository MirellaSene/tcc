import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import './../styles/login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { username, password });
    alert('Login realizado com sucesso!');
    navigate('/checkout'); 
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left login-left">
          <div className="auth-left-content">
            <h1>HELLO,<br />WELCOME<br />BACK!</h1>
            <div className="auth-buttons">
              <button className="auth-login-btn active">Sign in</button>
              <button className="auth-signup-btn" onClick={() => navigate('/signup')}>Sign up</button>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="logo-top" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span>ZELOOS</span>
          </div>
          
          <div className="form-container">
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="#" className="forgot-password">Forgot password?</Link>
              </div>
              <button type="submit" className="login-submit">Sign In</button>
            </form>
            
            <div className="or-divider">
              <span>Or continue with</span>
            </div>
            
            <div className="social-buttons">
              <button className="social-btn google">Google</button>
              <button className="social-btn facebook">Facebook</button>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup" className="link-btn">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;