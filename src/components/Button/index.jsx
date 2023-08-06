import React from "react";
import { CellState, CellValue } from "../../types/index";

const Button = ({ row, col, state, value, onClick, onContext, mark }) => {
  const renderContent = () => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span className="" role="img" aria-label="bomb">
            💣
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return (
        <span className="ml-[2px] text-[18px] " role="img" aria-label="flag">
          🚩
        </span>
      );
    }
    return null;
  };
  const color =
    value === 1
      ? "text-blue-800"
      : value === 2
      ? "text-green-800"
      : value === 3
      ? "text-red-800"
      : value === 4
      ? "text-purple-800"
      : value === 5
      ? "text-maroon-800"
      : value === 6
      ? "text-teal-800"
      : value === 7
      ? "text-black-800"
      : value === "8"
      ? "text-gray-800"
      : "";
  return (
    <div
      className={` ${
        state === CellState.visible
          ? `w-[30px] h-[30px] text-2xl font-bold ${
              mark[0] && mark[1] === row && mark[2] === col ? "bg-red-600" : ""
            } border-[#7b7b7b] border text-center flex justify-center items-center ${color}`
          : "w-[30px] h-[30px] border-4 border-solid border-r-[#7b7b7b] border-b-[#7b7b7b] border-l-white border-t-white active:border-l-[#7b7b7b] active:border-t-[#7b7b7b] active:border-r-white active:border-b-white"
      }`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
