import type { Route } from "./+types/match";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";

import { useGetMatchQuery, useMakeMoveMutation } from "~/features/match/matchApi";
import { BoardCard } from "~/features/match/BoardCard";
import { Scoreboard } from "~/features/match/Scoreboard";
import { useAppSelector } from "~/store/hooks";
import { useNow } from "~/lib/useNow";
import { getErrorMessage } from "~/lib/errors";
import { PLAYER_MARKS } from "~/types";

const ERROR_VISIBLE_MS = 4000;
const LOW_TIME_MS = 60_000;

const formatClock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="paper min-h-screen bg-bg text-main">
      <div className="mx-auto flex max-w-md flex-col gap-3 px-4 pb-6 pt-4 lg:max-w-6xl">{children}</div>
    </main>
  );
}

export default function MatchPage({ params }: Route.ComponentProps) {
  const session = useAppSelector((s) => s.session);
  const { data: match, isLoading, isError } = useGetMatchQuery(params.code);
  const [makeMove] = useMakeMoveMutation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [moveError, setMoveError] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    if (!moveError) return;
    const timer = setTimeout(() => setMoveError(null), ERROR_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [moveError]);

  if (session.playerId === null || session.code !== params.code) {
    return <Navigate to={`/?code=${params.code}`} replace />;
  }
  if (isLoading) {
    return <Shell><p className="pt-10 text-center font-pixel text-sm">LOADING MATCH…</p></Shell>;
  }
  if (isError || !match) {
    return (
      <Shell>
        <p className="mt-10 border-2 border-main px-3 py-2 font-pixel text-sm">! NO MATCH IS RUNNING IN THIS ROOM</p>
        <Link to={`/room/${params.code}`} className="font-pixel text-sm underline underline-offset-4">
          ◀ BACK TO THE LOBBY
        </Link>
      </Shell>
    );
  }

  const me = session.playerId;
  const seatsById = new Map(match.seats.map((s) => [s.playerId, s]));
  const myBoards = match.boards.filter((b) => b.whiteId === me || b.blackId === me);
  const waitingCount = myBoards.filter((b) => b.playerToMove === me).length;
  const safeIndex = Math.min(selectedIndex, Math.max(myBoards.length - 1, 0));
  const selected = myBoards[safeIndex];
  const opponentOf = (b: (typeof myBoards)[number]) =>
    seatsById.get(b.whiteId === me ? b.blackId : b.whiteId);

  const handleMove = async (boardId: number, uci: string) => {
    setMoveError(null);
    try {
      await makeMove({ code: match.roomCode, playerId: me, boardId, move: uci }).unwrap();
    } catch (err) {
      setMoveError(getErrorMessage(err));
    }
  };

  const goToNextWaiting = () => {
    for (let step = 1; step <= myBoards.length; step++) {
      const index = (safeIndex + step) % myBoards.length;
      if (myBoards[index].playerToMove === me) {
        setSelectedIndex(index);
        return;
      }
    }
  };

  if (match.status === "FINISHED") {
    const ranked = [...match.seats].sort((a, b) => b.score - a.score);
    const topScore = ranked[0]?.score ?? 0;
    const winners = ranked.filter((s) => s.score === topScore);
    const iWon = winners.length === 1 && winners[0].playerId === me;
    const title =
      winners.length > 1 ? "IT'S A TIE" : iWon ? "YOU WIN" : `${winners[0].name.toUpperCase()} WINS`;

    return (
      <Shell>
        <div className="flex flex-col gap-6 pt-10">
          <h1 className="m-0 text-center font-pixel text-4xl font-bold leading-tight text-pixel-shadow">{title}</h1>
          <div className="dither h-2.5 opacity-60" aria-hidden="true" />
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {ranked.map((s) => {
              //competition ranking (as seen in lib ranking)
              const rank = ranked.findIndex((r) => r.score === s.score) + 1;
              const isWinner = s.score === topScore;
              return (
                <li
                  key={s.playerId}
                  className={`flex h-14 items-center gap-3 border-2 border-main px-3
                    ${isWinner ? "bg-main text-bg" : "bg-card"}`}
                >
                  <span className="w-7 font-pixel text-lg">{rank}</span>
                  <span className="w-6 text-center text-xl" aria-hidden="true">{PLAYER_MARKS[s.position]}</span>
                  <span className="min-w-0 flex-1 truncate font-mono font-bold">
                    {s.playerId === me ? "You" : s.name}
                  </span>
                  <span className="font-pixel text-xl">{s.score}</span>
                </li>
              );
            })}
          </ol>
          <Link
            to={`/room/${match.roomCode}`}
            className="flex h-14 items-center justify-center gap-2 bg-main font-pixel text-xl text-bg pixel-shadow
                       active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span aria-hidden="true">◀</span> BACK TO LOBBY
          </Link>
        </div>
      </Shell>
    );
  }

  const remaining = match.endsAtEpochMs - now;
  const lowTime = remaining <= LOW_TIME_MS;

  return (
    <Shell>
      <header className="grid grid-cols-3 items-center">
        <span className="justify-self-start border-2 border-main px-2 py-1 font-pixel text-sm">{match.roomCode}</span>
        <div className="flex flex-col items-center" role="timer" aria-label="Match time left">
          <span className="font-pixel text-[10px] text-secondary">MATCH</span>
          <span
            className={`px-2 font-pixel text-3xl font-bold leading-none
              ${lowTime ? "animate-pulse bg-main text-bg" : ""}`}
          >
            {formatClock(remaining)}
          </span>
        </div>
        <span />
      </header>

      <Scoreboard seats={match.seats} me={me} />

      <p
        className={`m-0 border-2 border-main px-3 py-2 font-pixel text-xs
          ${waitingCount > 0 ? "bg-main text-bg" : "dither-bg text-secondary"}`}
      >
        {waitingCount === 0
          ? "WAITING FOR YOUR OPPONENTS…"
          : `▶ ${waitingCount} BOARD${waitingCount === 1 ? "" : "S"} NEED${waitingCount === 1 ? "S" : ""} YOUR MOVE`}
      </p>

      {moveError && (
        <p role="alert" className="m-0 flex items-start gap-2 border-2 border-dashed border-main px-3 py-2 font-pixel text-xs">
          <span aria-hidden="true">!</span>
          {moveError}
        </p>
      )}

      {/* Phone: tabs + one board */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div
          role="tablist"
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${myBoards.length}, minmax(0, 1fr))` }}
        >
          {myBoards.map((b, i) => {
            const opponent = opponentOf(b);
            const active = i === safeIndex;
            const myTurn = b.playerToMove === me;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedIndex(i)}
                className={`relative flex min-h-11 items-center justify-center gap-1 border-2 border-main px-2 font-pixel text-[11px]
                  ${active ? "bg-main text-bg" : "bg-card text-main"}`}
              >
                <span aria-hidden="true">{opponent ? PLAYER_MARKS[opponent.position] : "?"}</span>
                <span className="truncate">{opponent?.name ?? "?"}</span>
                {myTurn && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center border-2 border-bg bg-main font-pixel text-[9px] text-bg"
                    aria-label="Your move"
                  >
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <BoardCard board={selected} me={me} opponent={opponentOf(selected)} now={now} onMove={handleMove} />
        )}

        <button
          type="button"
          onClick={goToNextWaiting}
          disabled={waitingCount === 0}
          className="flex h-12 items-center justify-center gap-2 bg-main font-pixel text-sm text-bg pixel-shadow
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     disabled:opacity-40 disabled:shadow-none"
        >
          NEXT BOARD WAITING <span aria-hidden="true">▶</span>
        </button>
      </div>

      {/* Desktop: all boards side by side */}
      <div
        className="hidden gap-4 lg:grid"
        style={{ gridTemplateColumns: `repeat(${Math.max(myBoards.length, 1)}, minmax(0, 1fr))` }}
      >
        {myBoards.map((b) => (
          <BoardCard key={b.id} board={b} me={me} opponent={opponentOf(b)} now={now} onMove={handleMove} />
        ))}
      </div>
    </Shell>
  );
}