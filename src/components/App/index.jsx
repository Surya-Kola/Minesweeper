import React, { useEffect, useState } from "react";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils/index";
import Button from "../Button";
import { CellState, CellValue, Face } from "../../types";
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../../constants";

const App = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState(Face.smile);
  const [time, setTime] = useState(0);
  const [live, setLive] = useState(false);
  const [bombCounter, setBombCounter] = useState(NO_OF_BOMBS);
  const [hasLost, setHasLost] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [mark, setMark] = useState([false, -1, -1]);
  // console.log("cells",cells);
  const handleMouseDown = () => {
    setFace(Face.oh);
  };
  const handleMouseUp = () => {
    setFace(Face.smile);
  };

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hasWon]);

  const handleCellClick = (r, c) => () => {
    //start the game
    let newCells = cells.slice();
    if (!live) {
      let isBomb = newCells[r][c].value === CellValue.bomb;
      while (isBomb) {
        newCells = generateCells();
        if (newCells[r][c].value !== CellValue.bomb) {
          isBomb = false;
          break;
        }
      }

      setLive(true);
    }

    const currentCell = newCells[r][c];

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible
    ) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true);
      setMark([true, r, c]);
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, r, c);
    } else {
      newCells[r][c].state = CellState.visible;
    }
    //win
    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
      setBombCounter(0);
    }

    setCells(newCells);
  };
  const handleCellContext = (r, c) => (e) => {
    e.preventDefault(e);

    if (!live) return;

    const currentCells = cells.slice();
    const currentCell = cells[r][c];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[r][c].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[r][c].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const onFaceClick = () => {
    setLive(false);
    setTime(0);
    setBombCounter(NO_OF_BOMBS);
    setCells(generateCells());
    setHasLost(false);
    setMark([false,-1,-1]);
    setHasWon(false);
    setFace(Face.smile);
  };

  const renderCells = () => {
    return cells.map((row, ri) => {
      return row.map((cell, ci) => {
        return (
          <Button
            key={`${ri}-${ci}`}
            state={cell.state}
            value={cell.value}
            row={ri}
            col={ci}
            onClick={handleCellClick}
            onContext={handleCellContext}
            mark={mark}
          />
        );
      });
    });
  };

  const showAllBombs = () => {
    const currentCells = cells.slice();
    return currentCells.map((row, ri) =>
      row.map((cell, ci) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div className="bg-[#c2c2c2] p-4 border-4 border-solid border-r-[#999] border-b-[#999] border-l-white border-t-white">
      <div className="flex justify-between items-center bg-[#c0c0c0] py-[10px] px-[12px] border-4 border-solid border-l-[#7b7b7b] border-t-[#7b7b7b] border-r-white border-b-white ">
        <NumberDisplay value={bombCounter} />
        <div
          className="flex justify-center items-center w-[52px] h-[52px] text-[35px] border-4 border-solid border-r-[#999] border-b-[#999] border-l-white border-t-white cursor-pointer
        active:border-l-[#7b7b7b] active:border-t-[#7b7b7b] active:border-r-white active:border-b-white"
          onClick={onFaceClick}
        >
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div
        className={`mt-4 border-4 border-solid border-l-[#7b7b7b] border-t-[#7b7b7b] border-r-white border-b-white grid grid-rows-[repeat(9,1fr)] grid-cols-[repeat(9,1fr)] `}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        {renderCells()}
      </div>
    </div>
  );
};

export default App;
