import React, { useState, useEffect, useRef  } from "react";

import { ScoreProvider } from "./src/contexts/scoreContext";

import { Board } from "./src/components/Board/Board";

import "./assets/scss/main.scss"; // Chemin vers ton fichier SCSS




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
