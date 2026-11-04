import type { Player } from "~/types";

type PlayerListProps = {
  players: Player[];
  currentPlayerId: string;
  maxPlayers?: number;
};

export function PlayerList({ players, currentPlayerId, maxPlayers = 4 }: PlayerListProps) {
  const slots = Array.from({ length: maxPlayers }, (_, i) => players[i] ?? null);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between text-sm">
        <h2 className="font-bold">Players</h2>
        <span className="text-secondary">{players.length} of {maxPlayers}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {slots.map((player, i) =>
          player ? (
            <li
              key={player.id}
              className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-bg"
                style={{ backgroundColor: player.color }}
                aria-hidden="true"
              >
                {player.nickname[0].toUpperCase()}
              </span>
              <span className="flex-1 font-medium">{player.nickname}</span>
              <span className="text-xs text-secondary">
                {[player.isHost && "Host", player.id === currentPlayerId && "You"]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ) : (
            <li
              key={`empty-${i}`}
              className="flex h-14 items-center rounded-2xl border border-dashed border-border px-4 text-secondary"
            >
              Waiting for player…
            </li>
          )
        )}
      </ul>
    </section>
  );
}