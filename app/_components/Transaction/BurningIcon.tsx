import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import { KONVA_COLORS, TX_HEIGHT, TX_WIDTH, burnIconURL } from "~/app/_utils";

export const BurningIcon = () => {
  const [image] = useImage(burnIconURL);

  return (
    <Group>
      <Rect
        x={TX_WIDTH / 9}
        y={TX_HEIGHT - TX_WIDTH / 3 - TX_WIDTH / 9}
        stroke={KONVA_COLORS.RED_BURN_STROKE}
        strokeWidth={1}
        width={TX_WIDTH / 3}
        height={TX_WIDTH / 3}
        fill={KONVA_COLORS.RED_BURN_FILL}
        cornerRadius={4}
      />
      <Image
        image={image}
        alt="Burn"
        x={TX_WIDTH / 9}
        y={TX_HEIGHT - TX_WIDTH / 3 - TX_WIDTH / 9}
        width={TX_WIDTH / 3}
        height={TX_WIDTH / 3}
      />
    </Group>
  );
};