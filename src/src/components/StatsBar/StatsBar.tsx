import React from 'react';
import { useScoreContext } from '../../contexts/scoreContext';

type StatsBarProps = {

};

export const StatsBar: React.FC<StatsBarProps> = ({

}) => {

    const { cellsDestroyed, combos, maxCombosLength } = useScoreContext();


    return (
        <div className="stats-bar">
            <div className="item">💥 {cellsDestroyed} </div>
            <div className="item">🎉 {combos} </div>
            <div className="item">➿ {maxCombosLength} </div>
        </div>
    );
};
