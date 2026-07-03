import { Button } from "@heroui/react";

export interface PaginationButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function PaginationButton({
  onClick,
  isLoading = false,
  disabled = false,
  className = "",
  children,
}: PaginationButtonProps) {
  return (
    <Button
      onPress={onClick}
      isLoading={isLoading}
      isDisabled={disabled}
      variant="flat"
      className={`bg-explorer-row text-p-secondary shadow-sm ${className}`}
    >
      {children}
    </Button>
  );
}
