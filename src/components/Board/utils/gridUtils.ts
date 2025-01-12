import { CellDescriptor } from "../../../types/CellDescriptor";

/**
 * Retourne la première cellule non détruite dans une colonne donnée
 * @param column - Colonne ciblée (x)
 * @param grid - Grille à analyser
 * @param gridHeight - Hauteur de la grille
 * @returns La première cellule non détruite, ou undefined
 */
export const getFirstCellOfColumn = (
    grid: CellDescriptor[],
    column: number,
    gridHeight: number
): CellDescriptor | undefined => {
  let minY = gridHeight;
  let firstCell: CellDescriptor | undefined;

  grid.forEach((cell) => {
    if (
      cell.coordinates.x === column &&
      cell.coordinates.y < minY &&
      !cell.isDestroyed
    ) {
      minY = cell.coordinates.y;
      firstCell = cell;
    }
  });

  return firstCell;
};


export const generateRandomValue = (possibleValues: number, notIn: number[] = []): number => {
    let value = Math.floor(Math.random() * possibleValues);
    while (notIn.includes(value)) {
      value = Math.floor(Math.random() * possibleValues);
    }
    return value;
};

export const getCellsAbove = (grid: CellDescriptor[], cell: CellDescriptor, ) => {
    const cells: CellDescriptor[] = [];
    grid.forEach((cellDescriptor) => {
    if(
        cellDescriptor.coordinates.x === cell.coordinates.x
        && cellDescriptor.coordinates.y < cell.coordinates.y
        && !cellDescriptor.isDestroyed
    ) {
        cells.push(cellDescriptor);
    }
    });
    // sort by y
    cells.sort((a, b) =>  b.coordinates.y - a.coordinates.y);

    return cells;
};




export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const destroyCell = (grid: CellDescriptor[], cell: CellDescriptor) => {
  const clonedCell = { ...cell, isDestroyed: true };
  grid[cell.index] = clonedCell;
  return clonedCell;
};

export const getMatches = (
    grid: CellDescriptor[],
    gridWidth: number,
    gridHeight: number,
    matchSize: number
) => {
    const verticalMatches = getVerticalMatches(grid, gridWidth, matchSize);
    const horizontalMatches = getHorizontalMatches(grid, gridHeight, matchSize);
    const matches = [...horizontalMatches, ...verticalMatches];

    return matches;
}

export const getAboveCell = (grid: CellDescriptor[], cell: CellDescriptor) => {
  const aboveCell = getCellByCoordinates(grid, {
    x: cell.coordinates.x,
    y: cell.coordinates.y - 1 }
  );

  return aboveCell;
}

export const getRightCell = (grid: CellDescriptor[], cell: CellDescriptor) => {
  const rightCell = getCellByCoordinates(grid, {
    x: cell.coordinates.x + 1,
    y: cell.coordinates.y }
  );

  return rightCell;
}

export const getLeftCell = (grid: CellDescriptor[], cell: CellDescriptor) => {
  const leftCell = getCellByCoordinates(grid, {
    x: cell.coordinates.x - 1,
    y: cell.coordinates.y }
  );

  return leftCell;
}

export const getBottomCell = (grid: CellDescriptor[], cell: CellDescriptor) => {
  const bottomCell = getCellByCoordinates(grid, {
    x: cell.coordinates.x,
    y: cell.coordinates.y + 1 }
  );

  return bottomCell;
}


export const getCellByCoordinates = (grid: CellDescriptor[], coordinates: {x: number, y: number}) => {

  return grid.find((cell) => {
    return cell.coordinates.x === coordinates.x
      && cell.coordinates.y === coordinates.y
  });
};

export const areCellsAdjacent = (grid: CellDescriptor[], index1: number, index2: number) => {
  const { x: x1, y: y1 } = grid[index1].coordinates;
  const { x: x2, y: y2 } = grid[index2].coordinates;
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
};



const getHorizontalMatch = (grid: CellDescriptor[], gridWidth: number, cell: CellDescriptor) => {
    const matches: CellDescriptor[] = [cell];
    const { x, y } = cell.coordinates;
    const value = cell.value;

    // check left
    for (let i = x - 1; i >= 0; i--) {
      const leftCell = getCellByCoordinates(grid, { x: i, y });
      if (leftCell?.value === value) {
        matches.push(leftCell);
      } else {
        break;
      }
    }

    // check right
    for (let i = x + 1; i < gridWidth; i++) {
      const rightCell = getCellByCoordinates(grid, { x: i, y });
      if (rightCell?.value === value) {
        matches.push(rightCell);
      } else {
        break;
      }
    }

    return matches;
  };

  const getVerticalMatch = (grid: CellDescriptor[], gridHeight: number, cell: CellDescriptor) => {
    const matches: CellDescriptor[] = [cell];
    const { x, y } = cell.coordinates;
    const value = cell.value;

    // check top
    for (let i = y - 1; i >= 0; i--) {
      const topCell = getCellByCoordinates(grid, { x, y: i });
      if (topCell?.value === value) {
        matches.push(topCell);
      } else {
        break;
      }
    }

    // check bottom
    for (let i = y + 1; i < gridHeight; i++) {
      const bottomCell = getCellByCoordinates(grid, { x, y: i });
      if (bottomCell?.value === value) {
        matches.push(bottomCell);
      } else {
        break;
      }
    }

    return matches;
  }


  const getVerticalMatches = (grid: CellDescriptor[], gridHeight: number, matchSize: number) => {
    const matches: CellDescriptor[][] = [];

    const horizontalChecked: number[] = [];
    const verticalChecked: number[]= [];

    for (let i = 0; i < grid.length; i++) {
      const cellDescriptor = grid[i];
      if(cellDescriptor.isDestroyed) {
        continue;
      }

      if (!verticalChecked.includes(cellDescriptor.index)) {
        const verticalMatches = getVerticalMatch(grid, gridHeight, cellDescriptor);
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

  const getHorizontalMatches = (grid: CellDescriptor[], gridWidth: number, matchSize: number) => {
    const matches: CellDescriptor[][] = [];

    const horizontalChecked: number[] = [];

    for (let i = 0; i < grid.length; i++) {
      const cellDescriptor = grid[i];
      if(cellDescriptor.isDestroyed) {
        continue;
      }

      if (!horizontalChecked.includes(cellDescriptor.index)) {
        const horizontalMatches = getHorizontalMatch(grid, gridWidth, cellDescriptor);
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

