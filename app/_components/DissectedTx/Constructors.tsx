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
    <div className="mb-4">
      <p className="text-xl text-gray-600">{description}</p>
      {value?.toString() ? (
        <div
          className={
            "mt-4 break-words rounded-lg border-2 border-gray-700 bg-gray-200 p-4 text-xl shadow shadow-black " +
            `bg-${color}-200 border-${color}-700`
          }
        >
          <div className="text-sm text-gray-600">{title}</div>
          {value.toString()}
        </div>
      ) : (
        <EmptyBlock title={title} />
      )}
    </div>
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
    <div className="mb-4 mt-2 rounded-lg border-2 border-red-400 bg-red-200 p-4 text-xl text-red-600 shadow shadow-black">
      <div className="text-sm text-gray-600">{title}</div>
      {description ?? "Empty"}
    </div>
  );
}
