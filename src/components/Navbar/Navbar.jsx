import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/useCart";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../../services/products";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { cart, getCant } = useCart();
  const [categories, setCategories] = useState([]);
  // número total de items (suma de las cantidades 'count' en cada producto)
  const cartItems =
    typeof getCant === "function" ? getCant() : cart ? cart.length : 0;

  useEffect(() => {
    // Cierra el menú si se hace clic fuera de él
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    // Agrega el listener
    document.addEventListener("mousedown", handleClickOutside);
    // Limpia el listener al desmontar el componente
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (cancelled) return;

        const unique = Array.from(
          new Set(
            (data ?? [])
              .map((p) => (typeof p?.category === "string" ? p.category.trim() : ""))
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

        setCategories(unique);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Oculta el navbar en la página de inicio (ruta "/")
  if (location && location.pathname === "/") {
    return null;
  }

  return (
    <header
      className={`navbar ${isOpen ? "navbar--expanded" : "navbar--collapsed"}`}
    >
      {/* Logo + botón + carrito siempre visibles */}
      <div className="navbar__top">
        <div className="navbar__brand">
          <Link to="/products" className="navbar__logo">
            Fluxa
          </Link>
          
        </div>
        
        {/* Botón de menú */}
                  <button
            className={`navbar__toggle${isOpen ? " open" : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          
        <div className="navbar__right">

          {/* Icono del carrito */}
          <Link to="/cart" className={`navbar__cart ${cartItems > 0 ? 'has-items' : ''}`}>
            <div className="cart-icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#000000ff"
                  d="M2.5 2a.5.5 0 0 0 0 1h.246a.5.5 0 0 1 .48.363l1.586 5.55A1.5 1.5 0 0 0 6.254 10h4.569a1.5 1.5 0 0 0 1.393-.943l1.474-3.686A1 1 0 0 0 12.762 4H4.448l-.261-.912A1.5 1.5 0 0 0 2.746 2H2.5Zm4 12a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Zm4 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z"
                />
              </svg>
              {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
            </div>
          </Link>
        </div>
      </div>

      {/* Menú expandible */}
      <nav ref={menuRef} className="navbar__navigation">
        <ul className="navbar__menu">
          
          
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                to={`/category/${encodeURIComponent(cat)}`}
                onClick={() => setIsOpen(false)}
              >
                {cat.toLocaleUpperCase("es")}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
