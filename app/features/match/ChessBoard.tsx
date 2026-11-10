import { Chess, type Square, type PieceSymbol } from "chess.js";
import { useMemo, useState, type CSSProperties } from "react";

const GLYPHS: Record<PieceSymbol, string> = {
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};
const PIECE_NAMES: Record<PieceSymbol, string> = {
  k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn",
};
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

const WHITE_PIECE: CSSProperties = {
  color: "var(--egg)",
  textShadow: "0.4cqw 0 0 var(--ink), -0.4cqw 0 0 var(--ink), 0 0.4cqw 0 var(--ink), 0 -0.4cqw 0 var(--ink)",
};
const BLACK_PIECE: CSSProperties = {
  color: "var(--ink)",
  textShadow: "0.25cqw 0 0 var(--egg), -0.25cqw 0 0 var(--egg), 0 0.25cqw 0 var(--egg), 0 -0.25cqw 0 var(--egg)",
};

type ChessBoardProps = {
  fen: string;
  orientation: "white" | "black";
  canMove: boolean;
  onMove: (uci: string) => void;
};

export function ChessBoard({ fen, orientation, canMove, onMove }: ChessBoardProps) {
  const chess = useMemo(() => new Chess(fen), [fen]);
  const [selected, setSelected] = useState<Square | null>(null);

  const targetMoves = useMemo(
    () => (selected ? chess.moves({ square: selected, verbose: true }) : []),
    [chess, selected]
  );
  const targets = new Set(targetMoves.map((m) => m.to));

  const checkedKing = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turn = chess.turn();
    for (const row of chess.board()) {
      for (const cell of row) {
        if (cell && cell.type === "k" && cell.color === turn) return cell.square;
      }
    }
    return null;
  }, [chess]);

  const ranks = orientation === "white" ? RANKS : [...RANKS].reverse();
  const files = orientation === "white" ? FILES : [...FILES].reverse();
  const bottomRank = ranks[ranks.length - 1];
  const leftFile = files[0];

  const handleClick = (square: Square) => {
    if (!canMove) return;

    if (selected && targets.has(square)) {
      const promotion = targetMoves.some((m) => m.to === square && m.promotion) ? "q" : ""; // v1: auto-queen
      onMove(`${selected}${square}${promotion}`);
      setSelected(null);
      return;
    }

    if (square === selected) {
      setSelected(null);
      return;
    }

    const piece = chess.get(square);
    setSelected(piece && piece.color === chess.turn() ? square : null);
  };

  return (
    <div
      className="grid aspect-square w-full grid-cols-8 grid-rows-8 border-2 border-ink"
      style={{ containerType: "inline-size", touchAction: "manipulation" }}
    >
      {ranks.map((rank) =>
        files.map((file) => {
          const square = `${file}${rank}` as Square;
          const piece = chess.get(square);
          const isLight = (FILES.indexOf(file) + rank) % 2 === 0;
          const isSelected = selected === square;
          const isTarget = targets.has(square);
          const isCapture = isTarget && !!piece;
          const inCheck = checkedKing === square;

          const label =
            `${square}` +
            (piece ? `, ${piece.color === "w" ? "white" : "black"} ${PIECE_NAMES[piece.type]}` : "") +
            (inCheck ? ", in check" : "") +
            (isTarget ? (isCapture ? ", capture" : ", move here") : "");

          return (
            <button
              key={square}
              type="button"
              onClick={() => handleClick(square)}
              aria-label={label}
              aria-pressed={isSelected}
              className={`relative flex items-center justify-center p-0 leading-none bg-egg
                ${isLight ? "" : "dither-ink"}
                ${canMove ? "cursor-pointer" : "cursor-default"}`}
              style={{
                fontSize: "10cqw",
                boxShadow: isSelected ? "inset 0 0 0 0.9cqw var(--ink)" : undefined,
                ...(piece ? (piece.color === "w" ? WHITE_PIECE : BLACK_PIECE) : {}),
              }}
            >
              {/* Check: dashed frame, drawn under the piece */}
              {inCheck && (
                <span
                  aria-hidden="true"
                  className="absolute inset-[0.6cqw] animate-pulse border-dashed border-ink"
                  style={{ borderWidth: "0.6cqw" }}
                />
              )}

              {piece && <span className="relative">{GLYPHS[piece.type] + "\uFE0E"}</span>}

              {/* Quiet move: small square dot. Capture: corner brackets. */}
              {isTarget && !isCapture && (
                <span aria-hidden="true" className="absolute bg-ink" style={{ width: "3cqw", height: "3cqw" }} />
              )}
              {isCapture && <CaptureCorners />}

              {/* Coordinates on the bottom rank and left file */}
              {rank === bottomRank && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[0.4cqw] right-[0.6cqw] font-pixel text-ink"
                  style={{ fontSize: "2.2cqw", textShadow: "none" }}
                >
                  {file}
                </span>
              )}
              {file === leftFile && (
                <span
                  aria-hidden="true"
                  className="absolute left-[0.6cqw] top-[0.4cqw] font-pixel text-ink"
                  style={{ fontSize: "2.2cqw", textShadow: "none" }}
                >
                  {rank}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

function CaptureCorners() {
  const size = { width: "3.2cqw", height: "3.2cqw" };
  const edge = "0.9cqw solid var(--ink)";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-0 top-0" style={{ ...size, borderLeft: edge, borderTop: edge }} />
      <span className="absolute right-0 top-0" style={{ ...size, borderRight: edge, borderTop: edge }} />
      <span className="absolute bottom-0 left-0" style={{ ...size, borderLeft: edge, borderBottom: edge }} />
      <span className="absolute bottom-0 right-0" style={{ ...size, borderRight: edge, borderBottom: edge }} />
    </span>
  );
}