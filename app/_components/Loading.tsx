import { Spinner } from "@nextui-org/react";

export const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <Spinner size="lg" color="success" />
    </div>
  );
};
