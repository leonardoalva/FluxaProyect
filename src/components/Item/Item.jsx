import Counter from "../Counter/Counter";
import { Link, useLocation } from "react-router-dom";
import "./Item.css";
import React from "react";
import { useCart } from "../../context/useCart";

const Item = ({ id, name, price, description, imageUrl, children, category }) => {
  // Obtener la ubicación actual para condicionales de renderizado
  const location = useLocation();
  const { agregarAlCarrito } = useCart();

  // Mostrar el enlace de detalle solo si no estamos ya en la página de detalle
  const showDetailLink = !location.pathname.startsWith("/detail");


  return (
    <article className="card">
      <img
        className="imagen_card"
        // Manejo de la ruta de la imagen
        src={imageUrl}
        alt={description || name}
      />
      <div className="divDetailCard">
      <h3 className="nombre_card">{name}</h3>
      <div className="precio-detalle">
        <span className="precio_card">${price}</span>
        {
          // Mostrar el botón de detalle solo si corresponde
        }
        {showDetailLink && (
          <Link to={`/detail/${id}`} className="boton_detalle">
            <button className="btn_detalle">Ver detalle</button>
          </Link>
        )}
      </div>
      <p className="descripcion_card">{description}</p>
        

{/*  Si se pasan children, renderizarlos; si no, renderizar el Counter */}

      {children ? (
        children
      ) : (
        <Counter
          btnText="Agregar"
          onConfirm={(quantity) =>
            agregarAlCarrito({ id, name, price, description, imageUrl, count: quantity, category })
          }
        />
      )}

      </div>
    </article>
  );
};

export default Item;
