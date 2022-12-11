import React from 'react';

interface CustomButtonProps {
  btnType: 'button' | 'submit' | 'reset' | undefined;
  title: string;
  styles: string;
  handleClick: () => void;
}

const CustomButtom = ({
  btnType,
  title,
  styles,
  handleClick,
}: CustomButtonProps) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButtom;
