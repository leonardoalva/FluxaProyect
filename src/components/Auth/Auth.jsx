import React, { useState } from "react";
import Swal from "sweetalert2";
import AdminPanel from "../adminPanel/adminPanel";


function PasswordGate() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = "1234"; // 🔑 Aquí defines tu contraseña

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      Swal.fire({
        icon: "success",
        title: "Acceso concedido",
        text: "Bienvenido al panel de administración",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: "Intenta nuevamente",
      });
    }
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Ingresar contraseña:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Entrar</button>
    </form>
  );
}

export default PasswordGate;
