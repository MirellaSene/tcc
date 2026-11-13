import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import './../styles/signup.css';
import { api, saveSession, type Usuario } from '../services/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    try {
      const { token, usuario } = await api<{ token: string; usuario: Usuario }>('/auth/register', {
        method: 'POST',
        body: { username, email, password },
      });
      saveSession(token, usuario);
      alert('Cadastro realizado com sucesso!');
      navigate('/checkout');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1>CREATE<br />ACCOUNT</h1>
            <div className="auth-buttons">
              <button className="auth-login-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="auth-signup-btn active">Sign up</button>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="logo-top" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span>ZELOOS</span>
          </div>
          
          <div className="form-container">
            <h2>Create Account</h2>
            <p className="form-subtitle">Start your journey with us</p>
            
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
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <div className="input-group">
                <CheckCircle size={20} className="input-icon" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="signup-submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="link-btn">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;