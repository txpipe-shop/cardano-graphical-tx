import type { PropsWithChildren } from "react";

export type TopicMeta = {
  title: string;
  description?: React.ReactElement;
};

export function PropBlock({
  title,
  description,
  value,
  color,
}: {
  title?: string;
  description?: string;
  value: string | number | undefined;
  color?: "green" | "red";
}) {
  return (
    <div className="mb-4 w-full">
      <p className="text-xl text-p-secondary">{description}</p>
      {value?.toString() ? (
        <div
          className={`
            mt-4 break-words rounded-lg border-2
            border-gray-700 bg-background p-4 
            text-xl shadow shadow-shadow 
            ${color ? `bg-${color}-1 border-${color}-3` : "bg-background"}
          `}
        >
          <div className="text-sm text-p-primary">{title}</div>
          {value.toString()}
        </div>
      ) : (
        <EmptyBlock title={title} />
      )
      }
    </div >
  );
}

export function EmptyBlock({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mb-4 mt-2 rounded-lg border-2 border-red-3 bg-red-1 p-4 text-xl text-red-2 shadow shadow-black">
      <div className="text-sm text-p-primary">{title}</div>
      {description ?? "Empty"}
    </div>
  );
}

// REVIEW: replace with accordion?
export function Section(props: PropsWithChildren<{ title: string }>) {
  return (
    <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-10 border-border">
      <h4 className="text-3xl">{props.title}</h4>
      {props.children}
    </blockquote>
  );
}
