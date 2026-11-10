import { ChessBoard } from "./ChessBoard";
import { SegmentedTimer } from "~/components/SegmentedTimer";
import { PLAYER_MARKS } from "~/types";
import type { BoardState, SeatScore } from "~/types/match";

const MOVE_TIMEOUT_S = 60; // keep in sync with desperado.match.move-timeout
const HURRY_AT_S = 15;

type BoardCardProps = {
  board: BoardState;
  me: number;
  opponent: SeatScore | undefined;
  now: number;
  onMove: (boardId: number, uci: string) => void;
};

const formatSeconds = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function BoardCard({ board, me, opponent, now, onMove }: BoardCardProps) {
  const myTurn = board.playerToMove === me;
  const orientation = board.whiteId === me ? "white" : "black";
  const secondsLeft = Math.max(0, Math.ceil((board.turnDeadlineEpochMs - now) / 1000));
  const hurry = myTurn && secondsLeft <= HURRY_AT_S;
  const myPoints = board.points[String(me)] ?? 0;
  const opponentName = opponent?.name ?? "?";

  return (
    <section
      aria-label={`Board against ${opponentName}${myTurn ? ", your move" : ""}`}
      className={`flex flex-col gap-2.5 bg-card p-3
        ${myTurn ? "border-4 border-main pixel-shadow" : "border-2 border-secondary"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-lg leading-none" aria-hidden="true">
            {opponent ? PLAYER_MARKS[opponent.position] : "?"}
          </span>
          <span className="truncate font-mono text-sm font-bold">vs {opponentName}</span>
        </span>
        <span
          className={`shrink-0 px-1.5 py-0.5 font-pixel text-[11px]
            ${myTurn ? "bg-main text-bg" : "text-secondary"}
            ${hurry ? "animate-pulse" : ""}`}
        >
          {myTurn ? (hurry ? "HURRY!" : "YOUR MOVE") : "THEIR MOVE"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <SegmentedTimer secondsLeft={secondsLeft} totalSeconds={MOVE_TIMEOUT_S} dimmed={!myTurn} />
        <span className={`w-10 text-right font-pixel text-xs ${myTurn ? "" : "text-secondary"}`}>
          {formatSeconds(secondsLeft)}
        </span>
      </div>

      <ChessBoard
        key={board.fen}
        fen={board.fen}
        orientation={orientation}
        canMove={myTurn}
        onMove={(uci) => onMove(board.id, uci)}
      />

      <div className="flex items-center justify-between font-pixel text-[11px] text-secondary">
        <span className="flex items-center gap-1.5">
          <span
            className={`inline-block h-3 w-3 border-2 border-main ${orientation === "white" ? "bg-egg" : "bg-ink"}`}
            aria-hidden="true"
          />
          YOU PLAY {orientation.toUpperCase()}
        </span>
        <span>
          THIS BOARD <span className="text-sm text-main">+{myPoints}</span>
        </span>
      </div>
    </section>
  );
}