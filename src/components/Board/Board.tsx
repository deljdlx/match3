import React, { useState, useEffect, useRef } from "react";

import { useScoreContext } from "../../contexts/scoreContext";

import {
  getMatches,
  areCellsAdjacent,
  sleep,
  getAboveCell,
  getRightCell,
  getBottomCell,
  getLeftCell,
  getCellByCoordinates
} from "./utils/gridUtils";

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


  async function handleMatches() {
    setIsLocked(true);

    const matches = getMatches(grid, gridWidth, gridHeight, matchSize);
    if(matches.length) {
      setComboLength(comboLength + 1);
      setMatches(matches);
      await sleep(100);
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


  const canSwap = (index1: number, index2: number) => {
    if(areCellsAdjacent(grid, index1, index2) || 1) {
      return true;
    }
  }


  const handleClick = (index: number, cellDescriptor: CellDescriptor) => {
    if(isLocked) {
      return;
    }

    if (firstCellIndex === undefined) {
        grid[index].isSelected = true;
        setFirstCellIndex(index);
        return;
    }

    if(canSwap(firstCellIndex, index)) {
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


  const handleSwipe = async (cellDescriptor: CellDescriptor, direction: number) => {

    if(isLocked) {
      return;
    }

    // up
    if( direction === 0 ) {
      const aboveCell = getAboveCell(grid, cellDescriptor);

      if(aboveCell !== undefined) {
        if(canSwap(cellDescriptor.index, aboveCell.index)) {
          setFirstCellIndex(cellDescriptor.index);
          const firstCell = grid[cellDescriptor.index];
          const secondCell = grid[aboveCell.index];
          const tempCoordinates = firstCell.coordinates;
          firstCell.coordinates = secondCell.coordinates;
          secondCell.coordinates = tempCoordinates;
          handleMatches();
        }
      }
      return;
    }

    if( direction === 1 ) {
      const rightCell = getRightCell(grid, cellDescriptor);
      if(rightCell !== undefined) {
        if(canSwap(cellDescriptor.index, rightCell.index)) {
          setFirstCellIndex(cellDescriptor.index);
          const firstCell = grid[cellDescriptor.index];
          const secondCell = grid[rightCell.index];
          const tempCoordinates = firstCell.coordinates;
          firstCell.coordinates = secondCell.coordinates;
          secondCell.coordinates = tempCoordinates;
          handleMatches();
        }
      }
      return;
    }

    if( direction === 2 ) {
      const bottomCell = getBottomCell(grid, cellDescriptor);
      if(bottomCell !== undefined) {
        if(canSwap(cellDescriptor.index, bottomCell.index)) {
          setFirstCellIndex(cellDescriptor.index);
          const firstCell = grid[cellDescriptor.index];
          const secondCell = grid[bottomCell.index];
          const tempCoordinates = firstCell.coordinates;
          firstCell.coordinates = secondCell.coordinates;
          secondCell.coordinates = tempCoordinates;
          handleMatches();
        }
      }
      return;
    }

    if( direction === 3 ) {
      const leftCell = getLeftCell(grid, cellDescriptor);
      if(leftCell !== undefined) {
        if(canSwap(cellDescriptor.index, leftCell.index)) {
          setFirstCellIndex(cellDescriptor.index);
          const firstCell = grid[cellDescriptor.index];
          const secondCell = grid[leftCell.index];
          const tempCoordinates = firstCell.coordinates;
          firstCell.coordinates = secondCell.coordinates;
          secondCell.coordinates = tempCoordinates;
          handleMatches();
        }
      }
      return;
    }

  };




  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const handlePlayClick = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
    }
  };

  const wowAudioRef = useRef<HTMLAudioElement>(null);
  const playWow = () => {
    if (wowAudioRef.current) {
      wowAudioRef.current.play();
    }
  }

  return (
    <div className="board" onClick={handlePlayClick} onTouchEnd={handlePlayClick}>
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
                                    onSwipe={(cellDescriptor, direction) => handleSwipe(cellDescriptor, direction)}
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
    </div>
  );
}

