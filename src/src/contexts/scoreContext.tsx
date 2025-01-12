import React, { createContext, useContext, useState, ReactNode } from "react";

type ScoreContextType = {
  incrementScore: (value: number) => void;
    resetScore: () => void;
    score: number;
    cellsDestroyed: number;
    combos: number;
    maxCombosLength: number;
    incrementCellsDestroyed: (value: number) => void;
    incrementCombos: (value: number) => void;
    setMaxCombosLength: (value: number) => void;
};

// Crée un contexte avec un type par défaut (null)
const ScoreContext = createContext<ScoreContextType | null>(null);

// Crée un fournisseur pour encapsuler l'application ou des composants spécifiques
export const ScoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [score, setScore] = useState(0);
    const [cellsDestroyed, setCellsDestroyed] = useState(0);
    const [combos, setCombos] = useState(0);
    const [maxCombosLength, setMaxCombosLengthState] = useState(0);

    const incrementScore = (value: number) => {
        setScore((prev) => prev + value);
    };

    const resetScore = () => {
        setScore(0);
    };

    const incrementCellsDestroyed = (value: number) => {
        setCellsDestroyed((prev) => prev + value);
    };

    const incrementCombos = (value: number) => {
        setCombos((prev) => prev + value);
    }

    const setMaxCombosLength = (value: number) => {
        if (value > maxCombosLength) {
            setMaxCombosLengthState(value);
        }
    }



  return (
    <ScoreContext.Provider value={{
        score,
        incrementScore,
        resetScore,
        cellsDestroyed,
        incrementCellsDestroyed,
        combos,
        incrementCombos,
        maxCombosLength,
        setMaxCombosLength
    }}>
        {children}
    </ScoreContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useScoreContext = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};