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

  const [globalDelay, setGlobalDelay] = useState<number>(300);


  const [cellSize, setCellSize] = useState<number>(50);
  const [cellMoveDuration, setCellMoveDuration] = useState<number>(300);
  const [cellDestroyDuration, setCellDestroyDuration] = useState<number>(500);
  const [cellMoveDownDuration, setCellMoveDownDuration] = useState<number>(300);
  const [firstCellIndex, setFirstCellIndex] = useState<number | undefined>();
  const [grid, setGrid] = useState<CellDescriptor[]>([]);

  const [matches, setMatches] = useState<CellDescriptor[][]>([]);

  const [destructionPending, setDestructionPending] = useState<boolean>(false);
  const [moveDownPending, setMoveDownPending] = useState<boolean>(false);
  const [fillEmptyPending, setFillEmptyPending] = useState<boolean>(false);


  useEffect(() => {
    console.log('%cRENDER =============================', 'color: #0ff; font-size: 2rem');
    console.log(destructionPending);
  });


  useEffect(() => {
    const cells = [];
    let index = 0;
    let lastValue = -1;

    for (let i = 0; i < gridHeight; i++) {
        const row: CellDescriptor[] = [];
        for (let j = 0; j < gridWidth; j++) {

          const cellDescriptor: CellDescriptor = createCellDescriptor(index);
          cellDescriptor.coordinates = {
            x: j,
            y: i,
          };

          const notIn: number[] = [];
          notIn.push(lastValue);
          // try to get above cell
          const aboveCell = cells[index - gridWidth] || null;
          if(aboveCell) {
            notIn.push(aboveCell.value);
          }

          let newValue = generateRandomValue(notIn);
          cellDescriptor.value = newValue;
          lastValue = newValue;

          cells.push(cellDescriptor);

          index++;
        }
    }
    setGrid(cells);

    // =================================================================


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
    setGlobalDelay(parseInt(
      rootStyles.getPropertyValue("--global-delay").trim()
    ));
  }, []);


  useEffect(() => {

    console.log('%cHANDLE DESTROY:' + destructionPending, 'color: #0ff; font-size: 2rem');
    if(!matches.length || !destructionPending) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      matches.forEach((match) => {
        match.forEach((cellDescriptor) => {
          newGrid[cellDescriptor.index] = {
            ...newGrid[cellDescriptor.index],
            isDestroyed: true,
          };
        });
      });
      return newGrid;
    });

    setDestructionPending(false);

    setTimeout(() => {
      setMoveDownPending(true);
    }, globalDelay);

  }, [destructionPending]);

  useEffect(() => {

    if(!matches.length || !moveDownPending) {
      return;
    }

    console.log('%cHANDLE MOVE DOWN', 'color: #0ff; font-size: 2rem');
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      matches.forEach((match) => {
        const matchBottom = Math.max(...match.map((cell) => cell.coordinates.y));
        const matchTop = Math.min(...match.map((cell) => cell.coordinates.y));
        const matchHeight = matchBottom - matchTop + 1;



        let handledColumns: { [key: number]: boolean } = {};

        match.forEach((cellDescriptor) => {
          const cellsAbove = getCellsAbove(cellDescriptor, grid);
          console.log('%cBoard.tsx :: 119 =============================', 'color: #f00; font-size: 1rem');
          console.log(cellDescriptor.coordinates.x);
          console.log(cellsAbove);

          if(!handledColumns[cellDescriptor.coordinates.x]) {
            cellsAbove.forEach((cell) => {
              const newCell = grid[cell.index];

              console.log('%cBoard.tsx :: 124 =============================', 'color: #f00; font-size: 1rem');
              console.log('Moving down cell: ' + cell.coordinates.x + ' - ' + cell.coordinates.y +
                ' to ' +  (cell.coordinates.y + matchHeight)
              );
              newCell.coordinates.y += matchHeight;
              handledColumns[cell.coordinates.x] = true;
            });
          }
        });
      });
      return newGrid;
    });

    setMoveDownPending(false);
    //  setGridAsReady();
    setTimeout(() => {
      setFillEmptyPending(true);
    }, globalDelay);
  }, [moveDownPending]);

  useEffect(() => {
    console.log('%cHANDLE FILL CELLS', 'color: #0ff; font-size: 2rem');
    setDestructionPending(false);
    setMoveDownPending(false);
    setMatches([]);

    if(!matches.length) {
      return;
    }




    return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid.forEach((cell) => {
        if(cell.isDestroyed) {
          const firstCell = getFirstCellOfColumn(cell.coordinates.x, newGrid);

          cell.isDestroyed = false;
          cell.value = generateRandomValue();

          if(firstCell) {
            cell.coordinates = {
              x: cell.coordinates.x,
              y: firstCell.coordinates.y - 1,
            };
          }
        }
      });

      return newGrid;
    });

    setFillEmptyPending(false);
    setGridAsReady();

  }, [fillEmptyPending]);



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

  const generateRandomValue = (notIn: number[] = []): number => {
    let value = Math.floor(Math.random() * possibleValues);
    while (notIn.includes(value)) {
      value = Math.floor(Math.random() * possibleValues);
    }
    return value;
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

  const getFirstCellOfColumn = (column: number, newGrid: CellDescriptor[] | null = null) => {
    let minY = gridHeight;
    let firstCell: CellDescriptor | undefined;

    newGrid = newGrid || grid;

    newGrid.forEach((cell) => {
      if(cell.coordinates.x === column && cell.coordinates.y < minY && !cell.isDestroyed) {
        minY = cell.coordinates.y;
        firstCell = cell;
      }
    });

    return firstCell;
  };

  const getCellsAbove = (cell: CellDescriptor, newGrid: CellDescriptor[] | null = null) => {
    const cells: CellDescriptor[] = [];
    newGrid = newGrid || grid;

    newGrid.forEach((cellDescriptor) => {
      if(
        cellDescriptor.coordinates.x === cell.coordinates.x
        && cellDescriptor.coordinates.y < cell.coordinates.y
        && !cellDescriptor.isDestroyed
        // && !cellDescriptor.isMovingDown
      ) {
        cells.push(cellDescriptor);
      }
    });

    return cells;
  }

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








  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async function handleMatches() {
    const verticalMatches = getVerticalMatches();
    const horizontalMatches = getHorizontalMatches();
    const matches = [...verticalMatches, ...horizontalMatches];
    if(matches.length) {
      console.log(matches);
      setMatches(matches);
      await delay(globalDelay);
      setDestructionPending(true);
    }
  }


  const handleClick = (index: number, cellDescriptor: CellDescriptor) => {
    // =======================================
    if (firstCellIndex === undefined) {
        grid[index].isSelected = true;
        setFirstCellIndex(index);
        return;
    }

    if(areAdjacent(firstCellIndex, index) || 1) {
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


  return (
    <div className="board">
      {grid.length > 0 && (
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
      )}
    </div>
  );
}

