import ItemList from "../ItemList/ItemList";
import "./ItemListContainer.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../services/products";


const ItemListContainer = ({ titulo }) => {
  // estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const { category } = useParams();


  useEffect(() => {
    // Obtener productos desde el servicio
    getProducts()
      // Filtrar productos por categoría si se proporciona
      .then((data) => {
        if (category) {
          setProducts(data.filter((product) => product.category === category));
        } else {
          setProducts(data);
        }
      })

      // Manejar errores en la carga de datos
      .catch((error) => console.error("Error al cargar los productos:", error));
  }, [category]);



  // renderizado
    return (
    <main className="item-list-container">


      <div>
        {products.length > 0 ? <ItemList products={products} /> : <p>Cargando productos...</p>
}
      </div>
    </main>
  );
};

export default ItemListContainer;
