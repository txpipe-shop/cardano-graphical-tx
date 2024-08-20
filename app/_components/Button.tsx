import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "submit" | "button";
  className?: string;
  color?: "blue" | "pink";
}

export function Button({
  type = "button",
  children,
  className: customClassName,
  color = "blue",
  onClick: onClickFn,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClickFn}
      type={type}
      disabled={disabled}
      className={`inline-flex h-14 w-full select-none appearance-none items-center justify-center rounded-lg rounded-b-xl border-2 border-b-8 border-blue-950 px-6 py-2 text-center text-lg font-semibold tracking-wide placeholder-gray-400 shadow shadow-black outline-none duration-300 ease-in-out focus:outline-none sm:w-auto ${
        color === "blue"
          ? "bg-blue-400 hover:text-white"
          : "hover:bg-pink-200 focus:bg-pink-400"
      } ${customClassName} disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:text-black`}
    >
      {children}
    </button>
  );
}
