import { ImageResponse } from "next/og";
import {
  OPEN_GRAPH_IMAGE_SIZE,
  OpenGraphImage,
  type OpenGraphFact,
  type OpenGraphKind,
} from "~/app/_components/OpenGraph/OpenGraphImage";

export const ogImageSize = OPEN_GRAPH_IMAGE_SIZE;
export const ogImageContentType = "image/png";

export type OpenGraphImageData = {
  kind: OpenGraphKind | string;
  title: string;
  eyebrow?: string;
  description?: string;
  chain?: string | null;
  facts?: OpenGraphFact[];
};

export function renderOpenGraphImage(data: OpenGraphImageData) {
  return new ImageResponse(
    <OpenGraphImage {...data} logoSrc={"https://laceanatomy.com/txpipe.png"} />,
    OPEN_GRAPH_IMAGE_SIZE,
  );
}
