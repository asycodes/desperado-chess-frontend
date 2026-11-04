import type { Route } from "./+types/lobby";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { RoomCodeCard } from "~/features/lobby/RoomCodeCard";
import { PlayerList } from "~/features/lobby/PlayerList";
import type { GameMode, Player } from "~/types";

const MIN_PLAYERS = 2;
const CURRENT_PLAYER_ID = "p1"; // TODO: comes from sessionSlice once joining is real

const PLACEHOLDER_PLAYERS: Player[] = [
  { id: "p1", nickname: "Asyraf", color: "#F28C38", isHost: true },
  { id: "p2", nickname: "Mei Ling", color: "#5AA9FF", isHost: false },
  { id: "p3", nickname: "Ravi", color: "#E66AA8", isHost: false },
];

const MODES: { id: GameMode; label: string; description: string }[] = [
  { id: "FFA", label: "Free-for-All", description: "Most points wins" },
  { id: "FFA_ECONOMY", label: "FFA + Economy", description: "Buy pieces with gold" },
];

export default function Lobby({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>("FFA");

  const players = PLACEHOLDER_PLAYERS;
  const me = players.find((p) => p.id === CURRENT_PLAYER_ID);
  const isHost = me?.isHost ?? false;
  const hasEnoughPlayers = players.length >= MIN_PLAYERS;
  const canStart = isHost && hasEnoughPlayers;

  function handleStart() {
    if (!canStart) return;
    // TODO: send "start match" with the chosen mode to the server over WebSocket.
    // The server will broadcast MATCH_STARTED and every player navigates then.
    navigate(`/room/${params.code}/match`);
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

        <RoomCodeCard code={params.code} />

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

        <PlayerList players={players} currentPlayerId={CURRENT_PLAYER_ID} />

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