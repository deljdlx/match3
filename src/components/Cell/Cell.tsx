import React from "react";
import { CellDescriptor } from "../../types/CellDescriptor";


import clickSound from "../../assets/sounds/effects/magic-fairy.mp3";


type CellProps = {
  descriptor: CellDescriptor;
  onClick: (value: CellDescriptor) => void;
  cellSize: number;
  onSwipe: (value: CellDescriptor, direction: number) => void;
};


export const Cell: React.FC<CellProps> = ({
    descriptor,
    onClick,
    cellSize,
    onSwipe,
  }) => {

    const [touchStart, setTouchStart] = React.useState<{ x: number, y: number } | null>(null);

    const audioRef = React.createRef<HTMLAudioElement>();

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Redémarre le son si déjà en cours
      audioRef.current.play();
    }

    onClick(descriptor);
  };

  const handleSwipe = (descriptor: CellDescriptor, direction: number) => {
    onSwipe(descriptor, direction);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStart) {
      const xDiff = event.changedTouches[0].clientX - touchStart.x;
      const yDiff = event.changedTouches[0].clientY - touchStart.y;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          // Droite
          handleSwipe(descriptor, 1);
        } else {
          // Gauche
          handleSwipe(descriptor, 3);
        }
      } else {
        if (yDiff > 0) {
          // Bas
          handleSwipe(descriptor, 2);
        } else {
          // Haut
          handleSwipe(descriptor, 0);
        }
      }
    }
  }


  return (
    <>

      <audio ref={audioRef}>
        <source src={clickSound} type="audio/mpeg" />
      </audio>


      <div
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
