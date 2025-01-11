import React, { useState, useEffect } from "react";
import { Board } from "./src/components/Board";


import "./assets/scss/main.scss"; // Chemin vers ton fichier SCSS

function App() {

  const [gridWidth, setGridWidth] = useState<number>(10);
  const [gridHeight, setGridHeight] = useState<number>(15);



  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Board
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        possibleValues={7}
        matchSize={3}
      />
    </div>
  );
}

export default App;
