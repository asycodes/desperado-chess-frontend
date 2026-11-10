const KNIGHT = [
  "..............",
  ".....##.......",
  "....####......",
  "...######.....",
  "..###.####....",
  "..#########...",
  ".##########...",
  ".####..#####..",
  "..##...#####..",
  "......######..",
  ".....######...",
  "....########..",
  "...##########.",
  "...##########.",
];

const PATH = KNIGHT.flatMap((row, y) =>
  [...row].map((cell, x) => (cell === "#" ? `M${x} ${y}h1v1h-1z` : ""))
).join("");

type PixelKnightProps = { size?: number; className?: string };

export function PixelKnight({ size = 112, className }: PixelKnightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Desperado knight"
      className={className}
    >
      <path d={PATH} fill="currentColor" />
    </svg>
  );
}