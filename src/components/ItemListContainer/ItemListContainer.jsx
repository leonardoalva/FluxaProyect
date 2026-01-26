import ItemList from "../ItemList/ItemList";
import "./ItemListContainer.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../services/products";


const ItemListContainer = ({ titulo }) => {
  // estado para almacenar los productos
  const [products, setProducts] = useState([]);
  let { category } = useParams();
  const normCategory = category ? category.trim().toLowerCase() : null;


  useEffect(() => {
    // Obtener productos desde el servicio
    getProducts()
      // Filtrar productos por categoría si se proporciona
      .then((data) => {
        if (normCategory) {
          setProducts(
            data.filter(
              (product) =>
                typeof product.category === "string" &&
                product.category.trim().toLowerCase() === normCategory
            )
          );
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
