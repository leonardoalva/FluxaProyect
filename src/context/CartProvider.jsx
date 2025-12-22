import { CartContext } from "./CartContext";
import { useState, useEffect } from "react";
import { AbortedDeferredError } from "react-router-dom";
import Swal from "sweetalert2";
import { getProduct, updateProduct } from "../services/products";

function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (prod) => {
    if (!prod) return;

    const prodCount = prod.count ?? 1;
    const prodWithCount = { ...prod, count: prodCount, price: prod.price ?? 0 };

    const isInCart = carrito.some(
      (item) => item && item.id === prodWithCount.id
    );

    if (isInCart) {
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

  const getCant = () => carrito.reduce((acc, prod) => acc + (prod?.count ?? 0), 0);

  const getTotal = () => carrito.reduce(
    (acc, prod) => acc + (prod?.count ?? 0) * (prod?.price ?? 0),
    0
  );

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
    }
  };
  
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

  if (!result.isConfirmed) return;

  Swal.fire({
    title: 'Procesando pedido',
    text: 'Actualizando stock...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    await Promise.all(
      carrito.map(async (item) => {
        const prod = await getProduct(item.id);
        const currentStock = Number(prod.stock) || 0;

        if (item.count > currentStock) {
          throw new Error(`Stock insuficiente para ${prod.name}`);
        }

        const updatedProduct = {
          ...prod,
          stock: currentStock - (item.count ?? 0)
        };

        // 👇 Usar la función de servicio en vez de BASE_URL
        await updateProduct(item.id, updatedProduct);
      })
    );

    setCarrito([]);
    Swal.fire({
      title: '¡Compra realizada!',
      text: 'Tu pedido ha sido procesado exitosamente.',
      icon: 'success',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error('Error al procesar el pedido:', err);
    Swal.fire({
      title: 'Error',
      text: `No fue posible actualizar el stock: ${err.message}`,
      icon: 'error',
    });
  }
};



  useEffect(() => {
    try {
      localStorage.setItem('fluxa_cart', JSON.stringify(carrito));
    } catch (e) {
      console.warn('No se pudo persistir el carrito en localStorage', e);
    }
    console.log("carrito actualizado:", carrito);
  }, [carrito]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluxa_cart');
      if (saved) setCarrito(JSON.parse(saved));
    } catch (e) {
      console.warn('No se pudo leer el carrito desde localStorage', e);
    }
  }, []);

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
