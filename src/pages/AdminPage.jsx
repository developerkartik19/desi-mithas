import { useEffect, useState } from 'react';
import { createAdminProduct, deleteAdminProduct, fetchAdminDashboard, updateAdminProduct } from '../api';

const AdminPage = () => {
  const [data, setData] = useState({ users: [], products: [], orders: [] });
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', image: '', stock: '' });

  const load = async () => {
    try {
      const response = await fetchAdminDashboard();
      setData(response?.data?.data || { users: [], products: [], orders: [] });
    } catch {
      setData({ users: [], products: [], orders: [] });
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAdminProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm({ name: '', price: '', category: '', description: '', image: '', stock: '' });
    load();
  };

  const handleDelete = async (id) => {
    await deleteAdminProduct(id);
    load();
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Admin dashboard</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" />
          <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <button className="login-btn" type="submit">Add product</button>
        </form>
        <div className="admin-grid">
          <div>
            <h3>Users</h3>
            {data.users.map((user) => <p key={user.id}>{user.full_name || user.email}</p>)}
          </div>
          <div>
            <h3>Orders</h3>
            {data.orders.map((order) => <p key={order.id}>{order.status}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
