import type { Route } from "./+types/lobby";
import { useState } from "react";
import { Link, Navigate } from "react-router";

import { RoomCodeCard } from "~/features/lobby/RoomCodeCard";
import { PlayerList } from "~/features/lobby/PlayerList";
import type { GameMode } from "~/types";
import { getErrorMessage } from "~/lib/errors";
import { useGetRoomQuery, useAddBotMutation, useStartMatchMutation } from "~/features/room/roomAPI";
import { useAppSelector } from "~/store/hooks";

const MIN_PLAYERS = 2;

const MODES: { id: GameMode; label: string; description: string; available: boolean }[] = [
  { id: "FFA", label: "FREE-FOR-ALL", description: "Most points wins", available: true },
  { id: "FFA_ECONOMY", label: "ECONOMY", description: "Coming in v2", available: false },
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg text-main">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-7 px-6 pb-8 pt-14">{children}</div>
    </main>
  );
}

export default function Lobby({ params }: Route.ComponentProps) {
  const session = useAppSelector((s) => s.session);
  const [mode, setMode] = useState<GameMode>("FFA");
  const [error, setError] = useState<string | null>(null);
  const [addBot, { isLoading: isAddingBot }] = useAddBotMutation();
  const [startMatch, { isLoading: isStarting }] = useStartMatchMutation();
  const { data: room, isLoading, isError } = useGetRoomQuery(params.code);

  if (isLoading) {
    return <Shell><p className="font-pixel text-sm">LOADING ROOM…</p></Shell>;
  }
  if (isError || !room) {
    return (
      <Shell>
        <p className="border-2 border-main px-3 py-2 font-pixel text-sm">! ROOM NOT FOUND</p>
        <Link to="/" className="font-pixel text-sm underline underline-offset-4">◀ BACK TO HOME</Link>
      </Shell>
    );
  }

  const isInThisRoom = session.code === room.code && session.playerId !== null;
  if (!isInThisRoom) return <Navigate to={`/?code=${room.code}`} replace />;
  if (room.active) return <Navigate to={`/room/${room.code}/match`} replace />;

  const roomCode = room.code;
  const players = room.players;
  const me = players.find((p) => p.id === session.playerId);
  const isHost = me?.isHost ?? false;
  const hasEnoughPlayers = players.length >= MIN_PLAYERS;
  const canStart = isHost && hasEnoughPlayers && !isStarting;

  const handleStart = async () => {
    if (!canStart || session.playerId === null) return;
    setError(null);
    try {
      await startMatch({ code: roomCode, requesterId: session.playerId, mode }).unwrap();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAddBot = async () => {
    if (session.playerId === null) return;
    setError(null);
    try {
      await addBot({ code: roomCode, requesterId: session.playerId }).unwrap();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center border-2 border-main font-pixel text-lg pixel-shadow-sm
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <span aria-hidden="true">◀</span>
        </Link>
        {isHost && <span className="font-pixel text-xs text-secondary">YOU ARE THE HOST</span>}
      </div>

      <RoomCodeCard code={room.code} />

      <section className="flex flex-col gap-2">
        <h2 className="m-0 font-pixel text-xs">MODE</h2>
        <div className="grid grid-cols-2 border-2 border-main">
          {MODES.map((m, i) => {
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                disabled={!isHost || !m.available}
                aria-pressed={selected}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2
                  ${i > 0 ? "border-l-2 border-main" : ""}
                  ${selected ? "bg-main text-bg" : "text-main"}
                  disabled:cursor-not-allowed ${!m.available ? "dither opacity-50" : ""}`}
              >
                <span className="font-pixel text-sm">{m.label}</span>
                <span className="text-[11px] opacity-80">{m.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <PlayerList
        players={players}
        currentPlayerId={session.playerId}
        onAddBot={isHost ? handleAddBot : undefined}
        isAddingBot={isAddingBot}
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 border-2 border-main px-3 py-2 font-pixel text-xs">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {isHost ? (
          <>
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="flex h-14 items-center justify-center gap-2 bg-main font-pixel text-xl text-bg pixel-shadow
                         active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                         disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <span aria-hidden="true">▶</span>
              {isStarting ? "STARTING…" : "START MATCH"}
            </button>
            {!hasEnoughPlayers && (
              <p className="text-center font-pixel text-xs text-secondary">
                NEED {MIN_PLAYERS}+ PLAYERS · ADD A BOT TO FILL A SEAT
              </p>
            )}
          </>
        ) : (
          <p className="text-center font-pixel text-xs text-secondary">
            WAITING FOR THE HOST<span className="animate-pulse">…</span>
          </p>
        )}
      </div>
    </Shell>
  );
}