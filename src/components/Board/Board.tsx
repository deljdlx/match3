import React, { useState, useEffect, useRef } from "react";

import { useScoreContext } from "../../contexts/scoreContext";

import { getMatches, areCellsAdjacent } from "./utils/gridUtils";

import { useInitializeBoard } from "./hooks/useInitializeBoard";
import { useDestroyCells } from "./hooks/useDestroyCells";
import { useMoveCellsDown } from "./hooks/useMoveCellsDown";
import { useFillGrid } from "./hooks/useFillGrid";

import { CellDescriptor } from "../../types/CellDescriptor";

import { Cell } from "../Cell/Cell";
import { ScoreCounter } from "../ScoreCounter/ScoreCounter";
import { StatsBar } from "../StatsBar/StatsBar";


import { AudioPlayer, AudioPlayerHandle } from "../AudioPlayer/AudioPlayer";

import track01 from "../../assets/sounds/tracks/01.mp3";
import wowSound from "../../assets/sounds/effects/wow.mp3";

type BoardProps = {
    gridWidth: number;
    gridHeight: number;
    possibleValues: number;
    matchSize: number;
};


export const Board: React.FC<BoardProps> = ({
    gridWidth,
    gridHeight,
    possibleValues,
    matchSize,
}) => {

  const { grid, setGrid, styles } = useInitializeBoard(gridWidth, gridHeight, possibleValues);


  const [globalDelay, setGlobalDelay] = useState<number>(300);
  const [firstCellIndex, setFirstCellIndex] = useState<number | undefined>();

  const [matches, setMatches] = useState<CellDescriptor[][]>([]);


  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [destructionPending, setDestructionPending] = useState<boolean>(false);
  const [moveDownPending, setMoveDownPending] = useState<boolean>(false);
  const [fillEmptyPending, setFillEmptyPending] = useState<boolean>(false);
  const [isLoopFinished, setIsLoopFinished] = useState<boolean>(false);

  const [comboLength, setComboLength] = useState<number>(0);

  // const hookDelay: number = 100;


  const {
    score,
    incrementScore,
    resetScore,
    incrementCellsDestroyed,
    incrementCombos,
    setMaxCombosLength,
    incrementScoreByValue
  } = useScoreContext();


  useEffect(() => {
    console.log('%cRENDER =============================', 'color: #f0f; font-size: 2rem');
    console.log(destructionPending);
    console.log(moveDownPending);
    console.log(fillEmptyPending);
  });


  useDestroyCells({
    grid,
    setGrid,
    matches,
    setMatches,
    destructionPending,
    setDestructionPending,
    setMoveDownPending,
  });

  useMoveCellsDown({
    setGrid,
    moveDownPending,
    setMoveDownPending,
    setFillEmptyPending,
  });


  useFillGrid({
    gridHeight,
    possibleValues,
    setGrid,
    fillEmptyPending,
    setFillEmptyPending,
    setIsLoopFinished,
  });


  useEffect(() => {
    console.log('%cHANDLING LOOP END =============================', 'color: #f00; font-size: 2rem');

    if(!isLoopFinished) {
      return;
    }

    const cellsDestroyed = matches.reduce((acc, match) => acc + match.length, 0);
    incrementCellsDestroyed(cellsDestroyed);
    handleScores(matches);
    setMatches([]);

    setIsLoopFinished(false);

    setTimeout(() => {
      handleMatches();
    }, 10);


  }, [isLoopFinished]);


  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async function handleMatches() {

    setIsLocked(true);

    const matches = getMatches(grid, gridWidth, gridHeight, matchSize);
    if(matches.length) {
      setComboLength(comboLength + 1);
      setMatches(matches);
      await sleep(globalDelay);
      setDestructionPending(true);
    }
    else {
      incrementCombos(Math.max(comboLength - 1, 0));
      setMaxCombosLength(Math.max(comboLength, 0));
      if(comboLength > 1) {
        playWow();
      }
      setComboLength(0);

      setIsLocked(false);
    }
  }

  const handleScores = (matches: CellDescriptor[][]) => {
    matches.forEach((match, index) => {
      incrementScore(10 * match.length * (index + 1) * (comboLength + 1));
      incrementScoreByValue(match[0].value, match.length);
    });
  };


  const handleClick = (index: number, cellDescriptor: CellDescriptor) => {
    // =======================================


    if(isLocked) {
      return;
    }

    if (firstCellIndex === undefined) {
        grid[index].isSelected = true;
        setFirstCellIndex(index);
        return;
    }

    if(areCellsAdjacent(grid, firstCellIndex, index) || 1) {
      const firstCell = grid[firstCellIndex];
      const secondCell = grid[index];

      const tempCoordinates = firstCell.coordinates;
      firstCell.coordinates = secondCell.coordinates;
      secondCell.coordinates = tempCoordinates;

      handleMatches();
    }


    grid[firstCellIndex].isSelected = false;
    setFirstCellIndex(undefined);
  }


  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const handlePlayClick = () => {
    // if (audioPlayerRef.current) {
    //   audioPlayerRef.current.play();
    // }
  };

  const wowAudioRef = useRef<HTMLAudioElement>(null);
  const playWow = () => {
    if (wowAudioRef.current) {
      wowAudioRef.current.play();
    }
  }

  return (
    <div className="board" onClick={handlePlayClick}>
      <audio ref={wowAudioRef}>
        <source src={wowSound} type="audio/mpeg" />
      </audio>

      <header>
        <div>
          <ScoreCounter score={score} />
        </div>
      </header>

      <div className="audio-player">
        <AudioPlayer ref={audioPlayerRef} src={track01} loop/>
      </div>

      <div className="panels">
          <div className="panel panel--grid">
            {(grid.length > 0 || matches.length > 0) && (
              <div className="grid">
                    {grid.map((descriptor, index) => {
                            return (
                                <Cell
                                    key={index}
                                    descriptor={descriptor}
                                    cellSize={styles.cellSize}
                                    onClick={(cellDescriptor) => handleClick(index, cellDescriptor)}
                                />
                            );
                        })
                    }
                </div>
            )}
          </div>
          <div className="panel panel--stats">
            <StatsBar />
          </div>
      </div>
      {/* <footer>
        <StatsBar />
      </footer> */}
    </div>
  );
}

