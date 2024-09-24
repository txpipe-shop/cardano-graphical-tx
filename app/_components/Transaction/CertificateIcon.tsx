import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import {
  KONVA_COLORS,
  TX_HEIGHT,
  TX_WIDTH,
  certificateIconURL,
} from "~/app/_utils";

export const CertificateIcon = ({ on }: { on: boolean }) => {
  const [image] = useImage(certificateIconURL);

  return (
    <Group>
      <Rect
        x={TX_WIDTH / 4 + 64.5}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        stroke={KONVA_COLORS.PURPLE_STROKE}
        strokeWidth={2}
        width={TX_WIDTH / 5}
        height={TX_WIDTH / 5}
        fill={KONVA_COLORS.PURPLE_FILL}
        cornerRadius={4}
        opacity={on ? 1 : 0.2}
      />
      <Image
        image={image}
        opacity={on ? 1 : 0.2}
        alt="Mint"
        x={TX_WIDTH / 4 + 64.5}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        width={TX_WIDTH / 5.2}
        height={TX_WIDTH / 5.2}
      />
    </Group>
  );
};
