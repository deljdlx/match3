import React, { useState, useEffect } from "react";
import { ScoreProvider } from "../contexts/scoreContext";

import { Board } from "../components/Board/Board";


import "../assets/scss/main.scss"; // Chemin vers ton fichier SCSS



export const PlayPage: React.FC = () => {


  const [gridWidth, setGridWidth] = useState<number>(0);
  const [gridHeight, setGridHeight] = useState<number>(0);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);

    // console.log('%cPlayPage.tsx :: 20 =============================', 'color: #f00; font-size: 1rem');
    // console.log(rootStyles.getPropertyValue("--board-grid-columns").trim());

    setGridWidth(parseInt(
      rootStyles.getPropertyValue("--board-grid-columns").trim(), 10)
    );

    setGridHeight(parseInt(
      rootStyles.getPropertyValue("--board-grid-rows").trim(), 10)
    );
  }, []);


  return (
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
  );
};


