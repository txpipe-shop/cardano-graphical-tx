import type { SelectionMode } from "@nextui-org/react";

interface IAccordionStyle {
  title: string;
  subtitle: string;
  content: string;
  trigger: string;
  indicator: string;
}
export const defaultStyle = (
  title?: string,
  content?: string,
): IAccordionStyle => ({
  title: "text-3xl " + (title ?? ""),
  subtitle: "text-xl text-gray-600",
  content: content ? "border-dashed border-l-4 " + content : "",
  trigger: "py-2",
  indicator: "text-black text-2xl font-bold",
});

export const accordionItemProps = (
  key: string,
  classNames: IAccordionStyle,
  subtitule?: string,
) => ({
  key: key,
  classNames: { ...classNames },
  title: key,
  subtitle: subtitule,
  textValue: key,
});

export const accordionProps = (array: any[]) => ({
  selectionMode: "multiple" as SelectionMode,
  showDivider: false,
  isCompact: true,
  defaultExpandedKeys: [...Array(array.length + 1).keys()].map(String),
});
