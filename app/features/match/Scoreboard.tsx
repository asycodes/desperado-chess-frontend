import { PLAYER_MARKS } from "~/types";
import type { SeatScore } from "~/types/match";
import { competitionRanks } from "~/lib/ranking";

type ScoreboardProps = { seats: SeatScore[]; me: number };

export function Scoreboard({ seats, me }: ScoreboardProps) {
  const ordered = [...seats].sort((a, b) => a.position - b.position);
  const ranks = competitionRanks(ordered.map((s) => s.score));

  return (
    <ol
      aria-label="Scores"
      className="m-0 grid list-none gap-1.5 p-0 pt-3"
      style={{ gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))` }}
    >
      {ordered.map((s, i) => {
        const isMe = s.playerId === me;
        const rank = ranks[i];

        return (
          <li
            key={s.playerId}
            className={`relative flex flex-col items-center gap-1 px-1 pb-1.5 pt-2.5
              ${s.leader ? "bg-main text-bg" : "bg-card text-main"}
              ${isMe ? "border-4 border-main" : "border-2 border-main"}`}
          >
            {s.leader && (
              <span className="absolute -top-3 whitespace-nowrap border-2 border-main bg-bg px-1 font-pixel text-[9px] leading-[14px] text-main">
                {isMe ? "×2 ON YOU" : "×2 BOUNTY"}
              </span>
            )}

            <span className="flex w-full min-w-0 items-center justify-center gap-1">
              <span className="shrink-0 text-xs leading-none" aria-hidden="true">
                {PLAYER_MARKS[s.position]}
              </span>
              <span className="min-w-0 truncate font-mono text-xs font-bold">
                {isMe ? "You" : s.name}
              </span>
            </span>

            <span className="font-pixel text-xl leading-none">{s.score}</span>
            <span className="font-pixel text-[9px] opacity-70">#{rank}</span>

            <span className="sr-only">
              {`Rank ${rank}${s.leader ? ", leader, captures from them are worth double" : ""}${isMe ? ", this is you" : ""}`}
            </span>
          </li>
        );
      })}
    </ol>
  );
}