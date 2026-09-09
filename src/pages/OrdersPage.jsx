import { useEffect, useState } from 'react';
import { fetchOrders } from '../api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchOrders();
        setOrders(response?.data?.data?.orders || []);
      } catch {
        setOrders([]);
      }
    };
    load();
  }, []);

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Order history</h2>
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order) => <div key={order.id} className="product-card">{order.status}</div>)}
      </div>
    </section>
  );
};

export default OrdersPage;
