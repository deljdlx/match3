import React from "react";


type ScoreCounterProps = {
    score: number;
};


export const ScoreCounter: React.FC<ScoreCounterProps> = ({
    score
}) => {


    return (
        <div className="score-counter">
            <h1>Score : {score} </h1>
        </div>
    );
};
