import { ProductFormContainer } from "../adminComponents/ProductFormContainer/ProductFormContainer";
import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../../services/products";

import "./adminPanel.css";
import ItemDetailContainer from "../ItemDetailContainer/ItemDetailContainer";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || "Error al cargar productos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Admin Panel - Fluxa";
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setError("No se pudo eliminar el producto");
    }
  };

  const placeholderSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="100%" height="100%" rx="10" fill="#eef2ff" />
    <g fill="#9aa4b2">
      <rect x="18" y="36" width="84" height="48" rx="6" />
      <circle cx="60" cy="60" r="16" fill="#fff" />
    </g>
  </svg>`;
  const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(placeholderSvg);

  const getImageSrc = (product) => {
    if (!product) return placeholder;
    // common keys and nested arrays
    const firstImage = product.images && (product.images[0]?.url || product.images[0]?.imageUrl || product.images[0]);
    return (
      product.imageUrl ||
      product.image ||
      product.image_url ||
      product.thumbnail ||
      product.img ||
      firstImage ||
      placeholder
    );
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="btn add-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cerrar' : 'Agregar producto'}
        </button>
      </div>

      {showForm && (
        <ProductFormContainer
          onCreated={() => {
            loadProducts();
            setShowForm(false);
          }}
        />
      )}

      <section className="admin-products">
        <h2>Productos</h2>
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : products.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <ul className="product-list">
            {products.map((product) => {
              const src = getImageSrc(product);
              return (
                <li key={product.id} className="product-item">
                  <img
                    src={src}
                    alt={product.name || 'Producto'}
                    className="product-thumb"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />

                  <div className="product-info">
                    <div className="product-main">
                      <strong className="product-name">{product.name || 'Sin nombre'}</strong>
                    </div>

                    <div className="product-meta">
                      <span className="product-stock">Stock: {product.stock ?? '—'}</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>


    </div>
  );
}

export default AdminPanel;
