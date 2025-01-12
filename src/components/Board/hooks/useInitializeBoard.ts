import { useState, useEffect } from "react";
import { generateRandomValue } from "../utils/gridUtils";
import { CellDescriptor } from "../../../types/CellDescriptor";

export function useInitializeBoard(gridWidth: number, gridHeight: number, possibleValues: number) {
  const [grid, setGrid] = useState<CellDescriptor[]>([]);
  const [styles, setStyles] = useState({
    cellSize: 50,
    cellMoveDuration: 300,
    cellDestroyDuration: 500,
    cellMoveDownDuration: 300,
    globalDelay: 300,
  });

  useEffect(() => {
    // Initialize grid and styles
    const cells: CellDescriptor[] = [];
    let index = 0;

    for (let i = 0; i < gridHeight; i++) {
      for (let j = 0; j < gridWidth; j++) {

        let notIn: number[] = [];

        // avoid same adjacent values
        if(cells.length >= gridWidth) {
          notIn.push(cells[cells.length - gridWidth].value);
        }
        if(cells.length > 1) {
          notIn.push(cells[cells.length - 1].value);
        }

        cells.push({
          index,
          value: generateRandomValue(possibleValues, notIn),
          isSelected: false,
          isDestroyed: false,
          isMovingDown: false,
          coordinates: { x: j, y: i },
        });
        index++;
      }
    }
    setGrid(cells);

    const rootStyles = getComputedStyle(document.documentElement);
    setStyles({
      cellSize: parseInt(rootStyles.getPropertyValue("--cell-size").trim(), 10),
      cellMoveDuration: parseInt(rootStyles.getPropertyValue("--cell-move-duration").trim(), 10),
      cellDestroyDuration: parseInt(rootStyles.getPropertyValue("--cell-destroy-duration").trim(), 10),
      cellMoveDownDuration: parseInt(rootStyles.getPropertyValue("--cell-move-down-duration").trim(), 10),
      globalDelay: parseInt(rootStyles.getPropertyValue("--global-delay").trim(), 10),
    });
  }, [gridWidth, gridHeight, possibleValues]);

  return { grid, setGrid, styles };
}
