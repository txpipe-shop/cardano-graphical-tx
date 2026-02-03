import { type SelectionMode } from "@heroui/react";

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
  subtitle: "text-xl text-p-secondary",
  content: content ? "border-dashed border-border border-l-4 " + content : "",
  trigger: "py-2",
  indicator: "text-black text-2xl font-bold",
});

export const accordionItemProps = (
  title: string,
  classNames: IAccordionStyle,
  subtitule?: string,
) => ({
  classNames: { ...classNames },
  title: title,
  subtitle: subtitule,
  textValue: title,
});

export const accordionProps = (array: any[]) => ({
  selectionMode: "multiple" as SelectionMode,
  showDivider: false,
  isCompact: true,
  defaultExpandedKeys: [...Array(array.length + 1).keys()].map(String),
});
