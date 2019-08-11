import React, { useState } from "react";
import "./Login.css";

import api from "../services/api";

import logo from "../assets/logo.svg";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const { data: user } = await api.post("/devs", { username });

    const { _id } = user;

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login_container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input
          placeholder="Digite seu usuário no GitHub"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
