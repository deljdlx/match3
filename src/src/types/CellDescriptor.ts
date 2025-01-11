export type CellDescriptor = {
    index: number;
    value: number;
    isSelected: boolean;
    isDestroyed: boolean;
    isMovingDown: boolean;
    coordinates: {
      x: number;
      y: number;
    };
};
