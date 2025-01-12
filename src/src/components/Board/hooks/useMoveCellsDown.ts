import { CellDescriptor } from "../../../types/CellDescriptor";
import { getCellsAbove } from "../utils/gridUtils";


type UseMoveCellsDownProps = {
  setGrid: React.Dispatch<React.SetStateAction<CellDescriptor[]>>;
  moveDownPending: boolean;
  setMoveDownPending: React.Dispatch<React.SetStateAction<boolean>>;
  setFillEmptyPending: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useMoveCellsDown = ({
    setGrid,
    moveDownPending,
    setMoveDownPending,
    setFillEmptyPending,
}: UseMoveCellsDownProps) => {
    console.log('%cHANDLE MOVE CELLS DOWN:' + moveDownPending, 'color: #ff0; font-size: 2rem');

    if(!moveDownPending) {
      return;
    }

    console.log('%cHANDLE MOVE DOWN', 'color: #0ff; font-size: 2rem');
    setGrid((prevGrid) => {

      const newGrid = [...prevGrid].map((cell) => ({ ...cell }));

      const sortedDestroyedCells: {[key: number]: CellDescriptor[]} = {};

      newGrid.forEach((cell) => {
        if(cell.isDestroyed) {
          const clonedCell = { ...cell };
          sortedDestroyedCells[clonedCell.coordinates.x] = sortedDestroyedCells[clonedCell.coordinates.x] || [];
          sortedDestroyedCells[clonedCell.coordinates.x].push(clonedCell);
          // cell.coordinates.y = -1;
        }
      });

      for(let x  in sortedDestroyedCells) {
        const cells = sortedDestroyedCells[x];
        cells.sort((a, b) => a.coordinates.y - b.coordinates.y);
      }

      console.log('%cBoard.tsx :: 148 =============================', 'color: #f00; font-size: 1rem');
      console.log(sortedDestroyedCells);

      for(let x in sortedDestroyedCells) {
        const cells = sortedDestroyedCells[x];
        cells.forEach((cell, i) => {
          const cellsAbove = getCellsAbove(newGrid, cell);
          cellsAbove.forEach((cellAbove) => {
            newGrid[cellAbove.index].coordinates = {
              x: cellAbove.coordinates.x,
              y: cellAbove.coordinates.y + 1,
            };
          });
        });
      }

      return newGrid;
    });

    setMoveDownPending(false);
    setTimeout(() => {
      setFillEmptyPending(true);
    }, 300);
}
