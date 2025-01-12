import React from 'react';
import { useScoreContext } from '../../contexts/scoreContext';

type StatsBarProps = {

};

export const StatsBar: React.FC<StatsBarProps> = ({

}) => {

    const {
        cellsDestroyed,
        combos,
        maxCombosLength,
        scoreByValues
    } = useScoreContext();


    return (
        <div className="stats-bar">
            <div className="item">💥 {cellsDestroyed} </div>
            <div className="item">🎉 {combos} </div>
            <div className="item">➿ {maxCombosLength} </div>
            {
                Object.entries(scoreByValues).map(([value, count]) => (
                    <div key={value} className="item">
                        <span className={'score--' + value}></span> : {count}
                    </div>
                ))
            }


        </div>
    );
};
