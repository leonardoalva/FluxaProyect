import "./App.css";
import React from "react";
import Inicio from "./pages/Inicio";
import Cart from "./components/Cart/Cart";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./components/Auth/Auth";
import Footer from "./components/Footer/Footer";
import ItemListContainer from "./components/ItemListContainer/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer/ItemDetailContainer";
import Form from "./components/Form/Form";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductFormContainer } from "./components/adminComponents/ProductFormContainer/ProductFormContainer";
import AdminPanel from "./components/adminPanel/adminPanel";

function App() {
  const { id } = useParams();
  const { category } = useParams();
  return (
    <>
      <Navbar />
      <main className="app_main">
        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route path="/admin" element={<Auth />} />
          <Route
            path="/category/:category"
            element={<ItemListContainer titulo="categoria" />}
          />

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/products"
            element={<ItemListContainer titulo="Todos los Productos" />}
          />

          <Route path="/detail/:id" element={<ItemDetailContainer />} />
          {/* Podés agregar más rutas acá */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
