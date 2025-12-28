import "./ItemList.css";
import Item from "../Item/Item";

const ItemList = ({ products }) => {
  if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;

  // Agrupar productos por categoría
  const grouped = products.reduce((acc, prod) => {
    const cat = prod.category || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  // Ordenar nombres de categoría alfabéticamente
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  // Ordenar productos dentro de cada categoría por nombre
  sortedCategories.forEach((cat) => {
    grouped[cat].sort((p1, p2) => p1.name.localeCompare(p2.name, "es", { sensitivity: "base" }));
  });

  return (
    <>
      {sortedCategories.map((cat) => (
        <section key={cat} className="categorySection">
          <h2 className="categoryTitle">{cat}</h2>
          <div className="itemList_grid categoryGrid">
            {grouped[cat].map((prod) => (
              <Item key={prod.id} {...prod} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default ItemList;
