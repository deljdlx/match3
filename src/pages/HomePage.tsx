import React from "react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Bienvenue dans Match-3 !</h1>
      <Link to="/play">
        <button>Commencer à jouer</button>
      </Link>
    </div>
  );
};

