import { CellDescriptor } from "../../../types/CellDescriptor";

import { getFirstCellOfColumn, generateRandomValue, getMatches } from "../utils/gridUtils";


type UseFillGridProps = {
    gridHeight: number;
    possibleValues: number;
    setGrid: React.Dispatch<React.SetStateAction<CellDescriptor[]>>;
    fillEmptyPending: boolean;
    setFillEmptyPending: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoopFinished: React.Dispatch<React.SetStateAction<boolean>>;
};


export const useFillGrid = ({
    gridHeight,
    possibleValues,
    setGrid,
    fillEmptyPending,
    setFillEmptyPending,
    setIsLoopFinished,
}: UseFillGridProps) => {


    console.log('%cHANDLE FILL CELLS', 'color: #0f0; font-size: 2rem');
    if(!fillEmptyPending) {
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
    }, 100);

}

