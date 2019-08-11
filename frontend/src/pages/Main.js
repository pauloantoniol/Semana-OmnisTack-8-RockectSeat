import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import "./Main.css";

import api from "../services/api";

import logo from "../assets/logo.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ match }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const [oldMatchs, setOldMatchs] = useState([]);

  useEffect(() => {
    (async function() {
      const response = await api.get("/devs", {
        headers: { user: match.params.id }
      });

      const { data: matchs } = await api.get("/matchs", {
        headers: { user: match.params.id }
      });

      setUsers(response.data.sort(() => 0.5 - Math.random()));
      setLoading(false);

      if (matchs.length > 0) {
        setOldMatchs(matchs);
      }
    })();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  useEffect(() => {
    if (oldMatchs.length > 0) {
      const notify = JSON.parse(oldMatchs[0].how_machteu_me);
      setMatchDev(notify);
    }
  }, [oldMatchs]);

  async function handleSeeMatch(matchUser) {
    setMatchDev(null);

    await api.delete(`/matchs/${matchUser}`, {
      headers: { user: match.params.id }
    });

    if (oldMatchs.length > 0) {
      const [, ...rest] = oldMatchs;
      setOldMatchs(rest);
    }
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main_container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {loading ? (
        <div className="empty">Carregando...</div>
      ) : users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img
                src={user.avatar}
                alt={user.name}
                onClick={() => {
                  window.open(`https://github.com/${user.user}`, "_blank");
                }}
              />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button
                  type="button"
                  onClick={() => {
                    handleDislike(user._id);
                  }}
                >
                  <img src={dislike} alt="Dislike" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLike(user._id);
                  }}
                >
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :( </div>
      )}

      {matchDev && (
        <div className="match_container">
          <img src={itsamatch} alt="It's a match" />
          <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button
            type="button"
            onClick={() => {
              handleSeeMatch(matchDev._id);
            }}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
