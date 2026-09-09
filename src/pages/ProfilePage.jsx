import { useEffect, useState } from 'react';
import { fetchMe, updateProfile } from '../api';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ fullName: '', phone: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchMe();
        const user = response?.data?.data?.user || {};
        setProfile({ fullName: user.fullName || '', phone: user.phone || '', address: user.address || '' });
      } catch {
        setMessage('Unable to load profile');
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ fullName: profile.fullName, phone: profile.phone, address: profile.address });
      setMessage('Profile updated');
    } catch {
      setMessage('Update failed');
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Your profile</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Full Name" />
          <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
          <textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Address" />
          <button className="login-btn" type="submit">Save profile</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
};

export default ProfilePage;
