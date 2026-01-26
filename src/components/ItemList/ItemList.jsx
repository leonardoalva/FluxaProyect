import "./ItemList.css";
import Item from "../Item/Item";

const ItemList = ({ products }) => {
  if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;

  // Agrupar productos por categoría
  const grouped = products.reduce((acc, prod) => {
    const rawCat = (typeof prod.category === "string" ? prod.category.trim() : "Sin categoría");
    const normCat = rawCat.toLowerCase();
    if (!acc[normCat]) acc[normCat] = { label: rawCat, items: [] };
    acc[normCat].items.push(prod);
    return acc;
  }, {});

  // Ordenar nombres de categoría alfabéticamente
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    grouped[a].label.localeCompare(grouped[b].label, "es", { sensitivity: "base" })
  );

  // Ordenar productos dentro de cada categoría por nombre
  sortedCategories.forEach((catKey) => {
    grouped[catKey].items.sort((p1, p2) => p1.name.localeCompare(p2.name, "es", { sensitivity: "base" }));
  });

  return (
    <>
      {sortedCategories.map((catKey) => (
        <section key={catKey} className="categorySection">
          <h2 className="categoryTitle">{grouped[catKey].label}</h2>
          <div className="itemList_grid">
            {grouped[catKey].items.map((prod) => (
              <Item key={prod.id} {...prod} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default ItemList;
