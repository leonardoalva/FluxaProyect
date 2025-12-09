
import { CartContext } from "./CartContext";
import { useState, useEffect } from "react";
import { AbortedDeferredError } from "react-router-dom";
import Swal from "sweetalert2";

function CartProvider({ children }) {
  // Estado del carrito arranca vacío
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (prod) => {
    if (!prod) return; // proteger contra llamadas con undefined

  const prodCount = prod.count ?? 1; // por defecto 1 si no viene

  const prodWithCount = { ...prod, count: prodCount, price: prod.price ?? 0 };

  
    // Verifica si el producto ya está en el carrito
    const isInCart = carrito.some(
      (item) => item && item.id === prodWithCount.id
    );

    if (isInCart) {
      // Actualiza la cantidad del producto existente
      const productoRepetido = carrito.find(
        (item) => item && item.id === prodWithCount.id
      );
      const cartSinElProducto = carrito.filter(
        (item) => !(item && item.id === prodWithCount.id)
      );
      setCarrito([
        ...cartSinElProducto,
        {
          ...productoRepetido,
          count: (productoRepetido?.count ?? 0) + prodWithCount.count,
        },
      ]);
    } else {
      // Agrega el nuevo producto al carrito
      setCarrito([...carrito, prodWithCount]);
    }

    Swal.fire({
      title: "¡Producto agregado!",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const borrarDelCarrito = async (prod) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas eliminar este producto del carrito?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#748DAE',
      cancelButtonColor: '#9ECAD6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const cartSinElProducto = carrito.filter((item) => item.id !== prod.id);
      setCarrito(cartSinElProducto);
      
      Swal.fire({
        title: 'Eliminado',
        text: 'Producto removido del carrito',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const getCant = () => {
    return carrito.reduce((acc, prod) => acc + (prod?.count ?? 0), 0);
  };

  const getTotal = () => {
    return carrito.reduce(
      (acc, prod) => acc + (prod?.count ?? 0) * (prod?.price ?? 0),
      0
    );
  };

  const clearCart = async () => {
  const result = await Swal.fire({
    title: '¿Vaciar carrito?',
    text: '¿Estás seguro de que quieres vaciar tu carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#748DAE',
    cancelButtonColor: '#9ECAD6',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    setCarrito([]);
  };
  }
const checkout = async () => {
  const result = await Swal.fire({
    title: '¿Finalizar compra?',
    text: '¿Estás seguro de que quieres completar tu compra?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#748DAE',
    cancelButtonColor: '#9ECAD6',
    confirmButtonText: 'Sí, finalizar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    clearCart();
    Swal.fire({
      title: '¡Compra realizada!',
      text: 'Tu pedido ha sido procesado exitosamente.',
      icon: 'success',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
};

  // Loggea el carrito cada vez que cambie (útil para depuración)
  useEffect(() => {
    console.log("carrito actualizado:", carrito);
  }, [carrito]);

  return (
    <CartContext.Provider
      value={{
        cart: carrito,
        agregarAlCarrito,
        borrarDelCarrito,
        getCant,
        getTotal,
        clearCart,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
