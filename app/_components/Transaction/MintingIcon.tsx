import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import { KONVA_COLORS, TX_HEIGHT, TX_WIDTH, mintIconURL } from "~/app/_utils";

export const MintingIcon = ({ on }: { on: boolean }) => {
  const [image] = useImage(mintIconURL);

  return (
    <Group>
      <Rect
        x={TX_WIDTH - TX_WIDTH / 3}
        y={TX_HEIGHT - TX_WIDTH / 3}
        stroke={KONVA_COLORS.GREEN_MINT_STROKE}
        strokeWidth={2}
        width={TX_WIDTH / 4}
        height={TX_WIDTH / 4}
        fill={KONVA_COLORS.GREEN_MINT_FILL}
        shadowColor={
          on ? KONVA_COLORS.GREEN_MINT_FILL : KONVA_COLORS.TRANSAPARENT
        }
        shadowBlur={on ? 20 : 0}
        cornerRadius={4}
        opacity={on ? 1 : 0.2}
      />
      <Image
        image={image}
        opacity={on ? 1 : 0.2}
        alt="Mint"
        x={TX_WIDTH - TX_WIDTH / 3}
        y={TX_HEIGHT - TX_WIDTH / 3}
        width={TX_WIDTH / 4}
        height={TX_WIDTH / 4}
      />
    </Group>
  );
};
