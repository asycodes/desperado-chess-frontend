import { PLAYER_MARKS, type Player } from "~/types";

type PlayerListProps = {
  players: Player[];
  currentPlayerId: number | null;
  maxPlayers?: number;
  onAddBot?: () => void;
  isAddingBot?: boolean;
};

function Tag({ label, inverted = false }: { label: string; inverted?: boolean }) {
  return (
    <span
      className={`border-2 border-main px-1.5 py-0.5 font-pixel text-[10px] leading-none
        ${inverted ? "bg-main text-bg" : "text-main"}`}
    >
      {label}
    </span>
  );
}

export function PlayerList({
  players,
  currentPlayerId,
  maxPlayers = 4,
  onAddBot,
  isAddingBot = false,
}: PlayerListProps) {
  // Seat i shows whoever is in position i, so a gap stays in place if someone leaves.
  const slots = Array.from({ length: maxPlayers }, (_, i) =>
    players.find((p) => p.position === i + 1) ?? null
  );

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="m-0 font-pixel text-xs">PLAYERS</h2>
        <span className="font-pixel text-xs text-secondary">
          {players.length}/{maxPlayers}
        </span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {slots.map((player, i) => {
          const position = i + 1;

          if (!player) {
            return (
              <li
                key={`empty-${position}`}
                className="flex h-14 items-center gap-3 border-2 border-dashed border-secondary px-3 text-secondary"
              >
                <span className="w-6 text-center text-xl opacity-50" aria-hidden="true">
                  {PLAYER_MARKS[position]}
                </span>
                <span className="flex-1 font-pixel text-xs">
                  OPEN SEAT<span className="animate-pulse">…</span>
                </span>
                {onAddBot && (
                  <button
                    type="button"
                    onClick={onAddBot}
                    disabled={isAddingBot}
                    className="border-2 border-main px-2.5 py-1.5 font-pixel text-[11px] text-main pixel-shadow-sm
                               active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                               disabled:cursor-wait disabled:opacity-50"
                  >
                    {isAddingBot ? "ADDING…" : "+ ADD BOT"}
                  </button>
                )}
              </li>
            );
          }

          const isMe = player.id === currentPlayerId;

          return (
            <li
              key={player.id}
              className={`flex h-14 items-center gap-3 border-2 border-main bg-card px-3
                ${isMe ? "pixel-shadow" : ""}`}
            >
              <span className="w-6 text-center text-xl" aria-hidden="true">
                {PLAYER_MARKS[player.position]}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-base font-bold">
                {player.nickname}
              </span>
              <span className="flex shrink-0 gap-1.5">
                {player.isHost && <Tag label="HOST" />}
                {player.isBot && <Tag label="BOT" />}
                {isMe && <Tag label="YOU" inverted />}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}