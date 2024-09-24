import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import { KONVA_COLORS, TX_HEIGHT, TX_WIDTH, burnIconURL } from "~/app/_utils";

export const BurningIcon = ({ on }: { on: boolean }) => {
  const [image] = useImage(burnIconURL);

  return (
    <Group>
      <Rect
        x={TX_WIDTH / 12 - 6}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        stroke={KONVA_COLORS.RED_BURN_STROKE}
        strokeWidth={2}
        width={TX_WIDTH / 5}
        height={TX_WIDTH / 5}
        fill={KONVA_COLORS.RED_BURN_FILL}
        cornerRadius={4}
        opacity={on ? 1 : 0.2}
      />
      <Image
        image={image}
        opacity={on ? 1 : 0.2}
        alt="Burn"
        x={TX_WIDTH / 12 - 6}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        width={TX_WIDTH / 5}
        height={TX_WIDTH / 5}
      />
    </Group>
  );
};
