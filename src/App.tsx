import React, { useState, useEffect, useRef  } from "react";
import { Board } from "./src/components/Board";


import "./assets/scss/main.scss"; // Chemin vers ton fichier SCSS
import track01 from "./assets/sounds/tracks/01.mp3";

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



  const audioRef = useRef<HTMLAudioElement>(null);
  const handlePlay = () => {
    // if (audioRef.current) {
    //   audioRef.current.play().catch((error) => {
    //     console.error("Autoplay bloqué : ", error);
    //   });
    // }
  };

  return (
    <div className="application"
      onClick={handlePlay}
    >
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
      <div className="audio-player">
        <audio ref={audioRef} controls /*autoPlay={true}*/>
          <source src={track01} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default App;
