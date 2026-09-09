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
          <span className="hero-badge">Small-batch mithai · Made with warmth</span>
          <h1 className="hero-title">A little sweetness for every story.</h1>
          <p className="hero-description">From family recipes to your front door, discover fresh thekua and heritage sweets made for sharing.</p>
          <div className="hero-buttons">
            <a className="btn btn-primary" href="#products">Browse the mithai counter <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-note"><span>✦</span> Packed fresh every morning <span>✦</span> No fuss, just mithai</div>
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
