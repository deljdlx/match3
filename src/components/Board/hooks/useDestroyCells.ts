import { useEffect, useCallback } from "react";
import { CellDescriptor } from "../../../types/CellDescriptor";
import { destroyCell } from "../utils/gridUtils";

type UseDestroyCellsProps = {
  grid: CellDescriptor[];
  setGrid: React.Dispatch<React.SetStateAction<CellDescriptor[]>>;
  matches: CellDescriptor[][];
  setMatches: React.Dispatch<React.SetStateAction<CellDescriptor[][]>>;
  destructionPending: boolean;
  setDestructionPending: React.Dispatch<React.SetStateAction<boolean>>;
  setMoveDownPending: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Custom Hook : Gère la destruction des cellules dans la grille
 */
export const useDestroyCells = ({
  grid,
  setGrid,
  matches,
  setMatches,
  destructionPending,
  setDestructionPending,
  setMoveDownPending,
}: UseDestroyCellsProps) => {
  const handleDestroy = useCallback(() => {
    console.log('%cHANDLE DESTROY:' + destructionPending, 'color: #f0f; font-size: 2rem');

    if (!destructionPending) {
      return;
    }

    // Met à jour la grille en marquant les cellules correspondantes comme "détruites"
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      matches.forEach((match) => {
        match.forEach((cellDescriptor) => {
          destroyCell(newGrid, cellDescriptor);
        });
      });
      return newGrid;
    });

    // Réinitialise l'état de destruction et des correspondances
    setDestructionPending(false);

    // Planifie l'étape suivante (déplacement des cellules)
    setTimeout(() => {
      setMoveDownPending(true);
    }, 100);
  }, [destructionPending, grid, matches, setGrid, setMatches, setDestructionPending, setMoveDownPending, ]);

  // Effect principal pour observer `destructionPending`
  useEffect(() => {
    handleDestroy();
  }, [handleDestroy]);
};
