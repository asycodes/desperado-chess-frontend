import { PLAYER_COLORS, type Player } from "~/types";

type PlayerListProps = {
  players: Player[];
  currentPlayerId: number | null;
  maxPlayers?: number;
  onAddBot?: () => void;
  isAddingBot?: boolean;
};


export function PlayerList({ players, currentPlayerId, maxPlayers = 4, onAddBot, isAddingBot = false }: PlayerListProps) {
  // Seat i shows whoever is in position i, so a gap stays in place if someone leaves.
  const slots = Array.from({ length: maxPlayers }, (_, i) =>
    players.find((p) => p.position === i + 1) ?? null
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between text-sm">
        <h2 className="font-bold">Players</h2>
        <span className="text-secondary">{players.length} of {maxPlayers}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {slots.map((player, i) =>
          player ? (
            <li key={player.id} className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-bg"
                style={{ backgroundColor: PLAYER_COLORS[player.position] }}
                aria-hidden="true"
              >
                {player.nickname[0].toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{player.nickname}</span>
              <span className="text-xs text-secondary">
                  {[player.isHost && "Host", player.isBot && "Bot", player.id === currentPlayerId && "You"]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ) : (
            <li key={`empty-${i}`} className="flex h-14 items-center justify-between rounded-2xl border border-dashed border-border px-4 text-secondary">
              <span>Waiting for player…</span>
              {onAddBot && (
                <button
                  type="button"
                  onClick={onAddBot}
                  disabled={isAddingBot}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-main transition hover:border-accent disabled:opacity-50"
                >
                  {isAddingBot ? "Adding…" : "+ Add bot"}
                </button>
              )}
            </li>
          )
        )}
      </ul>
    </section>
  );
}