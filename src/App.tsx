import React, { useState, useEffect, useRef  } from "react";

import { ScoreProvider } from "./contexts/scoreContext";

import { Board } from "./components/Board/Board";

import "./assets/scss/main.scss"; // Chemin vers ton fichier SCSS



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { PlayPage } from "./pages/PlayPage";

const App: React.FC = () => {
  return (
    <ScoreProvider>
      <div className="application">
        <Router>
          <Routes>
            {/* Route pour l'écran d'accueil */}
            <Route path="/" element={<HomePage />} />

            {/* Route pour l'écran de jeu */}
            <Route path="/play" element={<PlayPage />} />
          </Routes>
        </Router>
      </div>
    </ScoreProvider>
  );
};

export default App;





/*
function App() {

  const [gridWidth, setGridWidth] = useState<number>(0);
  const [gridHeight, setGridHeight] = useState<number>(0);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);

    setGridWidth(parseInt(
      rootStyles.getPropertyValue("--board-grid-columns").trim(), 10)
    );

    setGridHeight(parseInt(
      rootStyles.getPropertyValue("--board-grid-rows").trim(), 10)
    );
  }, []);




  return (
    <ScoreProvider>
      <div className="application">
        <div>
          {gridWidth > 0 && gridHeight > 0 && (
            <Board
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              possibleValues={7}
              matchSize={3}
            />
          )}
        </div>
      </div>
    </ScoreProvider>
  );
}

export default App;

*/
