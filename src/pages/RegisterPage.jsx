import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
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
      const response = await registerUser(form);
      const user = response?.data?.data?.user ?? response?.data?.user ?? null;
      const requiresVerification = response?.data?.data?.requireEmailVerification;
      setUser(requiresVerification ? null : user);
      if (requiresVerification) {
        setMessage('Account created. Check your email to verify your account, then sign in.');
        navigate('/verify-email');
      } else if (user) {
        setMessage('Registration successful');
        navigate('/');
      } else {
        setMessage(response?.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Create account</h2>
        <p>Join Desi Mithas and enjoy a seamless shopping experience.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
