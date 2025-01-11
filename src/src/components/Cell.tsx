import React, {useEffect} from "react";
import { CellDescriptor } from "../types/CellDescriptor";

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


  const handleClick = () => {
    // const newValue = value + 1;
    onClick(descriptor);
  };

  return (
    <button
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
      <span className={'cell__sprite cell__sprite--'+descriptor.value}>
        {/* {descriptor.coordinates.x} - {descriptor.coordinates.y} */}
      </span>
    </button>
  );
};
