import { Input } from "@heroui/react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  inputSize?: "small" | "medium";
  label?: string;
  isCheckbox?: boolean;
  startContent?: React.ReactNode;
  value: string;
}

export function CustomInput({
  name,
  disabled,
  id,
  type,
  value,
  onChange,
  placeholder,
  className: customClassName,
  inputSize = "medium",
  label,
  isCheckbox = false,
  checked,
  startContent,
}: InputProps) {
  if (isCheckbox) {
    return (
      <div className="flex w-full flex-col justify-between p-2 text-left">
        <label htmlFor={id} className="cursor-pointer select-none text-xl">
          {label}
        </label>
        <div className="relative inline-block w-10 select-none align-top">
          <label className="cursor-pointer">
            <div
              className={`toggle-label flex h-7 items-center overflow-hidden rounded-full rounded-b-full border-2 border-b-4 border-input-border px-6 shadow-small shadow-black transition-all duration-400 ease-in-out ${checked ? "bg-green-200" : "bg-red-200"
                }`}
            >
              <input
                id={id}
                name={name}
                defaultChecked={checked}
                type="checkbox"
                onChange={onChange}
                className={`toggle-checkbox absolute block h-3 w-3 cursor-pointer appearance-none rounded-full bg-background transition-all duration-400 ease-in-out ${checked ? "left-8" : "left-2"
                  }`}
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
  return (
    <Input
      name={name}
      disabled={disabled}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      startContent={startContent}
      size={inputSize == "small" ? "sm" : "lg"}
      classNames={{
        innerWrapper: "bg-surface",
        inputWrapper: "bg-surface data-[hover=true]:bg-surface group-data-[focus=true]:bg-surface",
      }}
      className={`
        block appearance-none rounded-lg rounded-b-xl border-2
        bg-surface border-black shadow-black
        border-b-8 shadow
        ${inputSize == "small" ? "mt-0.5 h-10 w-3/4" : "mt-1 w-2/3"}
        ${customClassName} 
      `}
    />
  );
}
