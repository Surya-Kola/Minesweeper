import React from "react";

const NumberDisplay = ({ value }) => {
  return (
    <div className="flex justify-center w-[80px] h-[48px] bg-black text-[#ff0701] items-center text-[40px] ">
      {value<0 ? `-${Math.abs(value).toString().padStart(2,'0')}` :value.toString().padStart(3, "0")}
    </div>
  );
};

export default NumberDisplay;
