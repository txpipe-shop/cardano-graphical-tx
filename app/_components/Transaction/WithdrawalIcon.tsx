import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import {
  KONVA_COLORS,
  TX_HEIGHT,
  TX_WIDTH,
  withdrawalIconURL,
} from "~/app/_utils";

export const WithdrawalIcon = ({ on }: { on: boolean }) => {
  const [image] = useImage(withdrawalIconURL);

  return (
    <Group>
      <Rect
        x={TX_WIDTH / 4 + 34}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        stroke={KONVA_COLORS.YELLOW_STROKE}
        strokeWidth={2}
        width={TX_WIDTH / 5}
        height={TX_WIDTH / 5}
        fill={KONVA_COLORS.YELLOW_FILL}
        cornerRadius={4}
        opacity={on ? 1 : 0.2}
      />
      <Image
        image={image}
        opacity={on ? 1 : 0.2}
        alt="Burn"
        x={TX_WIDTH / 4 + 59}
        y={TX_HEIGHT - TX_WIDTH / 3 + 9}
        width={TX_WIDTH / 5}
        height={TX_WIDTH / 5}
        rotation={90}
      />
    </Group>
  );
};
