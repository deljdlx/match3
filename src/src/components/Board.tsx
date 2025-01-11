import React, { useState, useEffect } from "react";
import { CellDescriptor } from "../types/CellDescriptor";

import { Cell } from "./Cell";

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

  const [cellSize, setCellSize] = useState<number>(50);
  const [cellMoveDuration, setCellMoveDuration] = useState<number>(300);
  const [cellDestroyDuration, setCellDestroyDuration] = useState<number>(500);
  const [cellMoveDownDuration, setCellMoveDownDuration] = useState<number>(300);
  const [firstCellIndex, setFirstCellIndex] = useState<number | undefined>();
  const [grid, setGrid] = useState<CellDescriptor[]>([]);

  useEffect(() => {
    const cells = [];
    let index = 0;
    for (let i = 0; i < gridHeight; i++) {
        const row: CellDescriptor[] = [];
        for (let j = 0; j < gridWidth; j++) {

          const cellDescriptor: CellDescriptor = createCellDescriptor(index);
          cellDescriptor.coordinates = {
            x: j,
            y: i,
          };

          cellDescriptor.value = generateRandomValue();
          cells.push(cellDescriptor);

          index++;
        }
    }
    setGrid(cells);

  }, []);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const cellSize = rootStyles.getPropertyValue("--cell-size").trim();
    setCellSize(parseInt(cellSize, 10));

    const cellMoveDuration = rootStyles.getPropertyValue("--cell-move-duration").trim();
    setCellMoveDuration(parseInt(cellMoveDuration, 10));

    const cellDestroyDuration = rootStyles.getPropertyValue("--cell-destroy-duration").trim();
    setCellDestroyDuration(parseInt(cellDestroyDuration, 10));

    setCellMoveDownDuration(parseInt(
      rootStyles.getPropertyValue("--cell-move-down-duration").trim(), 10)
    );


  }, []);



  const createCellDescriptor = (index: number): CellDescriptor => {
    return {
      index,
      value: 0,
      isSelected: false,
      isDestroyed: false,
      isMovingDown: false,
      coordinates: {
        x: 0,
        y: 0,
      },
    };
  }

  const generateRandomValue = (): number => {
    return Math.floor(Math.random() * possibleValues);
  }

  const areAdjacent = (index1: number, index2: number) => {
    const coordinates1 = grid[index1].coordinates;
    const coordinates2 = grid[index2].coordinates;

    return Math.abs(coordinates1.x - coordinates2.x) <=1
      && Math.abs(coordinates1.y - coordinates2.y) <= 1;
  }

  const getCellByCoordinates = (coordinates: {x: number, y: number}) => {
    return grid.find((cell) => {
      return cell.coordinates.x === coordinates.x
        && cell.coordinates.y === coordinates.y
    });
  };

  const getHorizontalMatch = (cell: CellDescriptor) => {
    const matches: CellDescriptor[] = [cell];
    const { x, y } = cell.coordinates;
    const value = cell.value;

    // check left
    for (let i = x - 1; i >= 0; i--) {
      const leftCell = getCellByCoordinates({ x: i, y });
      if (leftCell?.value === value) {
        matches.push(leftCell);
      } else {
        break;
      }
    }

    // check right
    for (let i = x + 1; i < gridWidth; i++) {
      const rightCell = getCellByCoordinates({ x: i, y });
      if (rightCell?.value === value) {
        matches.push(rightCell);
      } else {
        break;
      }
    }

    return matches;
  };

  const getVerticalMatch = (cell: CellDescriptor) => {
    const matches: CellDescriptor[] = [cell];
    const { x, y } = cell.coordinates;
    const value = cell.value;

    // check top
    for (let i = y - 1; i >= 0; i--) {
      const topCell = getCellByCoordinates({ x, y: i });
      if (topCell?.value === value) {
        matches.push(topCell);
      } else {
        break;
      }
    }

    // check bottom
    for (let i = y + 1; i < gridHeight; i++) {
      const bottomCell = getCellByCoordinates({ x, y: i });
      if (bottomCell?.value === value) {
        matches.push(bottomCell);
      } else {
        break;
      }
    }

    return matches;
  }


  const getVerticalMatches = () => {
    const matches: CellDescriptor[][] = [];

    const horizontalChecked: number[] = [];
    const verticalChecked: number[]= [];

    for (let i = 0; i < grid.length; i++) {
      const cellDescriptor = grid[i];
      if(cellDescriptor.isDestroyed) {
        continue;
      }

      // if (!horizontalChecked.includes(cellDescriptor.index)) {
      //   const horizontalMatches = getHorizontalMatches(cellDescriptor);
      //   horizontalMatches.forEach((cellDescriptor) => {
      //     horizontalChecked.push(cellDescriptor.index);
      //   });

      //   if(horizontalMatches.length >= matchSize) {
      //     matches.push(horizontalMatches);
      //   }
      // }

      if (!verticalChecked.includes(cellDescriptor.index)) {
        const verticalMatches = getVerticalMatch(cellDescriptor);
        verticalMatches.forEach((cellDescriptor) => {
          verticalChecked.push(cellDescriptor.index);
        });

        if(verticalMatches.length >= matchSize) {
          matches.push(verticalMatches);
        }
      }
    }

    return matches;
  }

  const getHorizontalMatches = () => {
    const matches: CellDescriptor[][] = [];

    const horizontalChecked: number[] = [];

    for (let i = 0; i < grid.length; i++) {
      const cellDescriptor = grid[i];
      if(cellDescriptor.isDestroyed) {
        continue;
      }

      if (!horizontalChecked.includes(cellDescriptor.index)) {
        const horizontalMatches = getHorizontalMatch(cellDescriptor);
        horizontalMatches.forEach((cellDescriptor) => {
          horizontalChecked.push(cellDescriptor.index);
        });

        if(horizontalMatches.length >= matchSize) {
          matches.push(horizontalMatches);
        }
      }
    }

    return matches;
  }


  const setGridAsReady = () => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid.forEach((cell) => {
        cell.isMovingDown = false;
      });
      return newGrid;
    });
  };


  const handleCellDestroy = (match: CellDescriptor[]) => {
    match.forEach((cellDescriptor) => {


      const matchBottom = Math.max(...match.map((cell) => cell.coordinates.y));
      const matchTop = Math.min(...match.map((cell) => cell.coordinates.y));
      const matchHeight = matchBottom - matchTop + 1;

      setGrid((prevGrid) => {

        // destroy cells
        const newGrid = [...prevGrid];
        newGrid[cellDescriptor.index] = {
          ...newGrid[cellDescriptor.index],
          isDestroyed: true,
          coordinates: {
            x: cellDescriptor.coordinates.x,
            y: -1,
          },
        };


        // move cells down
        newGrid.forEach((cell) => {
          if(
            cell.coordinates.y < matchTop
            && cell.coordinates.x === cellDescriptor.coordinates.x
            && !cell.isDestroyed
            && !cell.isMovingDown
          ) {
            cell.isMovingDown = true;
            cell.coordinates.y += matchHeight;
          }
        });


        return newGrid;
      });
    });


    setTimeout(() => {
      setGridAsReady();
    }, cellMoveDownDuration + 10);
  };



  const handleClick = (index: number, cellDescriptor: CellDescriptor) => {
    // =======================================
    if (firstCellIndex === undefined) {
        grid[index].isSelected = true;
        setFirstCellIndex(index);
        return;
    }


    if(areAdjacent(firstCellIndex, index)) {
      const firstCell = grid[firstCellIndex];
      const secondCell = grid[index];

      const tempCoordinates = firstCell.coordinates;
      firstCell.coordinates = secondCell.coordinates;
      secondCell.coordinates = tempCoordinates;


      const verticalMatches = getVerticalMatches();
      verticalMatches.forEach((match) => {
        setTimeout(() => {
          handleCellDestroy(match);
        }, cellMoveDuration + 10);
      });

      const horizontalMatches = getHorizontalMatches();
      horizontalMatches.forEach((match) => {
        setTimeout(() => {
          handleCellDestroy(match);
        }, cellMoveDuration + 10);
      });
    }

    grid[firstCellIndex].isSelected = false;
    setFirstCellIndex(undefined);
  }


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
       <div className="grid">
            {grid.map((descriptor, index) => {
                    return (
                        <Cell
                            key={index}
                            descriptor={descriptor}
                            cellSize={cellSize}
                            onClick={(cellDescriptor) => handleClick(index, cellDescriptor)}
                        />
                    );
                })
            }
        </div>
    </div>
  );
}

