import { useCart } from "../../context/useCart";
import React from "react";
import "./Cart.css";

const Cart = () => {
  const { cart, borrarDelCarrito, getTotal, checkout, clearCart} = useCart();

  console.log("Carrito en componente Cart:", cart);

  const totalAmount = getTotal().toFixed(2);

  const imgSrc = (imageUrl, name) => {
    if (!imageUrl) return "/images/placeholder.png";
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  return (
    <div className="cart">
      <h2 className="cart__title">Carrito de Compras</h2>

      {!cart || cart.length === 0 ? (
        <p className="cart__empty">El carrito está vacío.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li className="cart-item" key={item.id}>
              <img
                className="cart-item__img"
                src={imgSrc(item.imageUrl, item.name)}
                alt={item.name}
                width="48"
                height="48"
              />

              <div className="cart-item__info">
                <div className="cart-item__title">{item.name}</div>

                <div className="cart-item__meta">
                  Precio: ${item.price ?? 0} × {item.count ?? 0} = $
                  {((item?.price ?? 0) * (item?.count ?? 0)).toFixed(2)}
                </div>

                <button className="botonDel" onClick={() => borrarDelCarrito(item)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <>
          <div className="cart__total">
            Total: <span className="cart__total-amount">${totalAmount}</span>
          </div>
          <button onClick={clearCart}>Vaciar Carrito</button>
          <button className="checkout-btn" onClick={checkout}>Finalizar Compra</button>
        </>
      )}
    </div>
  );
};

export default Cart;
