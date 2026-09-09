import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await loginUser(form);
      const user = response?.data?.data?.user ?? response?.data?.user ?? null;
      setUser(user);
      if (user) {
        setMessage('Login successful');
        navigate('/');
      } else {
        setMessage(response?.data?.message || 'Login failed. Please check your email and password.');
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to your Desi Mithas account.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
