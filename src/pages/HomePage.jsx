import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchProducts({ page: 1, limit: 8 });
        setProducts(response?.data?.data?.products || []);
      } catch {
        setProducts([]);
      }
    };
    load();
  }, []);

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge">Premium Traditional Sweets</span>
          <h1 className="hero-title">Authentic Taste, Modern Convenience</h1>
          <p className="hero-description">Enjoy fresh thekua and heritage sweets delivered to your home.</p>
          <div className="hero-buttons">
            <a className="btn btn-primary" href="#products">Shop now</a>
          </div>
        </div>
        <div id="products" className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">₹{product.price}</p>
                <p className="product-description">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
