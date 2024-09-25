import type { PropsWithChildren } from "react";

export type TopicMeta = {
  title: string;
  description?: React.ReactElement;
};

export function PropBlock({
  title,
  description,
  value,
}: {
  title: string;
  description?: string;
  value: string | undefined;
}) {
  return (
    <>
      {value ? (
        <div className="mb-4">
          <P>{description}</P>
          <div className="mt-4 break-words rounded-lg border-2 border-gray-700 bg-gray-200 p-4 text-xl shadow shadow-black">
            <div className="text-sm text-gray-600">{title}</div>
            {value ?? "(empty)"}
          </div>
        </div>
      ) : (
        <EmptyBlock />
      )}
    </>
  );
}

export function HexBlock(props: { name: string; value: string }) {
  return (
    <div className="mt-8 break-words rounded-lg border-2 border-green-700 bg-green-200 p-4 text-2xl shadow shadow-black">
      <div className="text-sm text-green-800">{props.name}</div>
      {props.value}
    </div>
  );
}

export function P(props: PropsWithChildren) {
  return <p className="text-xl text-gray-600">{props.children}</p>;
}

export function EmptyBlock() {
  return (
    <div className="mt-8 rounded-lg border-2 border-red-400 bg-red-200 p-4 text-xl text-red-600 shadow shadow-black">
      Empty
    </div>
  );
}
