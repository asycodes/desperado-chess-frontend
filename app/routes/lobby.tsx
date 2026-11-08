import type { Route } from "./+types/lobby";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { RoomCodeCard } from "~/features/lobby/RoomCodeCard";
import { PlayerList } from "~/features/lobby/PlayerList";
import type { GameMode, Player } from "~/types";
import { getErrorMessage } from "~/lib/errors";

import { useGetRoomQuery, useAddBotMutation, useStartMatchMutation } from "~/features/room/roomAPI";
import { useAppSelector } from "~/store/hooks";

const MIN_PLAYERS = 2;


const MODES: { id: GameMode; label: string; description: string }[] = [
  { id: "FFA", label: "Free-for-All", description: "Most points wins" },
  { id: "FFA_ECONOMY", label: "FFA + Economy", description: "Buy pieces with gold" },
];

export default function Lobby({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>("FFA");
  const playerId = useAppSelector((state) => state.session.playerId);
  const [addBot, { isLoading: isAddingBot }] = useAddBotMutation();
  const [botError, setBotError] = useState<string | null>(null);
  const [startMatch, { isLoading: isStarting }] = useStartMatchMutation();

  const session = useAppSelector((s) => s.session);
  const { data: room, isLoading, isError } = useGetRoomQuery(params.code)



  if (isLoading) {
    return <main className="min-h-screen bg-bg p-6 text-main">Loading room…</main>;
  }
  if (isError || !room) {
    return (
      <main className="min-h-screen bg-bg p-6 text-main">
        <p>Room not found.</p>
        <Link to="/" className="text-accent">Back to home</Link>
      </main>
    );
  }

  const isInThisRoom = session.code === room.code && session.playerId !== null;

  if (!isInThisRoom) {
    return <Navigate to={`/?code=${room.code}`} replace />;
  }
  if (room.active) {
    return <Navigate to={`/room/${room.code}/match`} replace />;
  }
  const players = room.players;
  const me = players.find((p) => p.id === session.playerId);
  const isHost = me?.isHost ?? false;
  const hasEnoughPlayers = players.length >= MIN_PLAYERS;
  const canStart = isHost && hasEnoughPlayers;

  const handleStart = async () => {
    if (!canStart || session.playerId === null) return;
    try {
      await startMatch({ code: room.code, requesterId: session.playerId, mode }).unwrap();
    } catch (err) {
      setBotError(getErrorMessage(err));
    }
  };
  const roomCode = room.code
  async function handleAddBot() {
    if (session.playerId === null) return;
    setBotError(null);
    try {
      await addBot({ code: roomCode, requesterId: session.playerId }).unwrap();
    } catch (err) {
      setBotError(getErrorMessage(err));
    }
  }

  return (
    <main className="min-h-screen bg-bg text-main">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-7 px-6 pb-8 pt-14">
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-secondary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          {isHost && <span className="text-secondary">You are the host</span>}
        </div>

        <RoomCodeCard code={room.code} />

        <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold">Mode</h2>
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1">
                {MODES.map((m) => {
                const selected = mode === m.id;
                return (
                    <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={selected}
                    className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-sm font-semibold transition ${
                        selected ? "bg-main text-bg" : "text-secondary hover:text-main"
                    }`}
                    >
                    <span>{m.label}</span>
                    <span className="text-xs font-normal opacity-80">{m.description}</span>
                    </button>
                );
                })}
            </div>
        </section>

        <PlayerList players={players} currentPlayerId={session.playerId} onAddBot={isHost ? handleAddBot : undefined} isAddingBot={isAddingBot}/>
        {botError && <p role="alert" className="text-sm text-red-300">{botError}</p>}

        <div className="mt-auto flex flex-col gap-2">
          {isHost ? (
            <>
              <button
                type="button"
                onClick={handleStart}
                disabled={!canStart}
                className="h-14 rounded-2xl bg-accent text-lg font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start match
              </button>
              {!hasEnoughPlayers && (
                <p className="text-center text-sm text-secondary">
                  Need at least {MIN_PLAYERS} players to start
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-secondary">Waiting for the host to start…</p>
          )}
        </div>
      </div>
    </main>
  );
}