import { CellDescriptor } from "../../../types/CellDescriptor";

import { getFirstCellOfColumn, generateRandomValue, getMatches } from "../utils/gridUtils";


type UseFillGridProps = {
    grid: CellDescriptor[];
    gridWidth: number;
    gridHeight: number;
    matchSize: number;
    globalDelay: number;


    possibleValues: number;

    setGrid: React.Dispatch<React.SetStateAction<CellDescriptor[]>>;
    moveDownPending: boolean;
    fillEmptyPending: boolean;
    setFillEmptyPending: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoopFinished: React.Dispatch<React.SetStateAction<boolean>>;
};


export const useFillGrid = ({
    grid,
    gridWidth,
    gridHeight,
    matchSize,
    globalDelay,
    possibleValues,
    setGrid,
    moveDownPending,
    fillEmptyPending,
    setFillEmptyPending,
    setIsLoopFinished,
}: UseFillGridProps) => {


    console.log('%cHANDLE FILL CELLS', 'color: #0f0; font-size: 2rem');
    if(moveDownPending || !fillEmptyPending) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid.forEach((cell) => {
        if(cell.isDestroyed) {
          const firstCell = getFirstCellOfColumn(newGrid, cell.coordinates.x, gridHeight);

          cell.isDestroyed = false;
          cell.value = generateRandomValue(possibleValues);

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
    setTimeout(() => {
        setIsLoopFinished(true);
    }, globalDelay);

}

