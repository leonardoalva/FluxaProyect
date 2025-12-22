import Item from '/src/components/Item/Item';
import Counter from '/src/components/Counter/Counter';
import { useCart } from "../../context/useCart";
import React from "react";
import "./ItemDetail.css";

const ItemDetail = ({ detail }) => {
  const {agregarAlCarrito} = useCart();

  const handleAdd = (quantity) => {
    agregarAlCarrito({ ...detail, count: quantity });
  }


  return (


    //En el caso de optar por la NO reutilizacion, pueden colocar el Link envolviendo el <article>
    //en Item y dejar como estaba el ItemList, sin modificaciones

    <Item {...detail}>
      <Counter btnText="Agregar" onConfirm={handleAdd} stock={detail.stock} />

      {/* <Counter item={detail} btnText="Agregar" onClick={() => agregarAlCarrito(detail)}  /> */}
    </Item>
  );
};

export default ItemDetail;
