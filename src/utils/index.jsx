import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants/index";
import { CellValue, CellState } from "../types/index";

const grabAllAdjacentCells = (cells, r, c) => {
  const topLeftCell = r > 0 && c > 0 ? cells[r - 1][c - 1] : null;
  const topCell = r > 0 ? cells[r - 1][c] : null;
  const topRightCell = r > 0 && c < MAX_COLS - 1 ? cells[r - 1][c + 1] : null;
  const leftCell = c > 0 ? cells[r][c - 1] : null;
  const rightCell = c < MAX_COLS - 1 ? cells[r][c + 1] : null;
  const bottomLeftCell = r < MAX_ROWS - 1 && c > 0 ? cells[r + 1][c - 1] : null;
  const bottomCell = r < MAX_ROWS - 1 ? cells[r + 1][c] : null;
  const bottomRightCell =
    r < MAX_ROWS - 1 && c < MAX_COLS - 1 ? cells[r + 1][c + 1] : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

export const generateCells = () => {
  let cells = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    cells.push([]);
    for (let j = 0; j < MAX_COLS; j++) {
      cells[i].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }
  let bombsPlaced = 0;
  // for (let i = 0; i < NO_OF_BOMBS; i++) {
  //   let x = Math.floor(Math.random() * MAX_ROWS);
  //   let y = Math.floor(Math.random() * MAX_COLS);

  //   while (cells[x][y].value === CellValue.bomb) {
  //     x = Math.floor(Math.random() * MAX_ROWS);
  //     y = Math.floor(Math.random() * MAX_COLS);
  //   }
  //   cells[x][y].value=CellValue.bomb;
  // }
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.bomb,
            };
          }
          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  //calculate the numbers
  for (let ri = 0; ri < MAX_ROWS; ri++) {
    for (let ci = 0; ci < MAX_COLS; ci++) {
      const currentCell = cells[ri][ci];
      if (currentCell.value === CellValue.bomb) continue;
      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAdjacentCells(cells, ri, ci);

      if (topLeftCell?.value === CellValue.bomb) numberOfBombs++;
      if (topCell?.value === CellValue.bomb) numberOfBombs++;
      if (topRightCell?.value === CellValue.bomb) numberOfBombs++;
      if (leftCell?.value === CellValue.bomb) numberOfBombs++;
      if (rightCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomLeftCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomRightCell?.value === CellValue.bomb) numberOfBombs++;

      if (numberOfBombs > 0) {
        cells[ri][ci] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (cells, r, c) => {
  const currentCell = cells[r][c];

  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[r][c].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  } = grabAllAdjacentCells(cells, r, c);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r - 1, c - 1);
    } else {
      newCells[r - 1][c - 1].state = CellState.visible;
    }
  }

  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r - 1, c);
    } else {
      newCells[r - 1][c].state = CellState.visible;
    }
  }

  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r - 1, c + 1);
    } else {
      newCells[r - 1][c + 1].state = CellState.visible;
    }
  }

  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r, c - 1);
    } else {
      newCells[r][c - 1].state = CellState.visible;
    }
  }

  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r, c + 1);
    } else {
      newCells[r][c + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r + 1, c - 1);
    } else {
      newCells[r + 1][c - 1].state = CellState.visible;
    }
  }

  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r + 1, c);
    } else {
      newCells[r + 1][c].state = CellState.visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r + 1, c + 1);
    } else {
      newCells[r + 1][c + 1].state = CellState.visible;
    }
  }

  return newCells;
};
