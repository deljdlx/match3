import React from "react";
import { CellDescriptor } from "../../types/CellDescriptor";


import clickSound from "../../assets/sounds/effects/magic-fairy.mp3";


type CellProps = {
  descriptor: CellDescriptor;
  onClick: (value: CellDescriptor) => void;
  cellSize: number;
};


export const Cell: React.FC<CellProps> = ({
    descriptor,
    onClick,
    cellSize,
  }) => {

    const audioRef = React.createRef<HTMLAudioElement>();

  const handleClick = () => {

    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Redémarre le son si déjà en cours
      audioRef.current.play();
    }


    onClick(descriptor);
  };

  return (
    <>

      <audio ref={audioRef}>
        <source src={clickSound} type="audio/mpeg" />
      </audio>


      <div
        onClick={handleClick}
        style={{
          left: `${descriptor.coordinates.x * cellSize}px`,
          top: `${descriptor.coordinates.y * cellSize}px`,
        }}
        className={[
          "cell",
          descriptor.isSelected ? 'cell--selected' : '',
          descriptor.isDestroyed ? 'cell--destroyed' : '',
          descriptor.isMovingDown ? 'cell--moving-down' : '',
        ].join(' ')}
      >
        <div className="cell__wrapper">
          <span className={'cell__sprite cell__sprite--'+descriptor.value}>
            {/* {descriptor.coordinates.x} - {descriptor.coordinates.y} */}
          </span>
        </div>
      </div>
    </>
  );
};
