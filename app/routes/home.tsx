import type { Route } from "./+types/home";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { CreateRoomButton } from "~/features/room/CreateRoomButton";
import { JoinRoomForm } from "~/features/room/JoinRoomForm";
import { PixelKnight } from "~/components/PixelKnight";

export function meta() {
  return [
    { title: "Desperado Chess" },
    { name: "description", content: "Chess can BE fun" },
  ];
}

const MAX_NICKNAME = 16;

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [searchParams] = useSearchParams();
  const invitedCode = searchParams.get("code")?.toUpperCase() ?? "";

  return (
    <main className="min-h-screen bg-bg text-main">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-7 px-6 pb-8 pt-14">
        <header className="flex flex-col items-center gap-3 pt-2 text-center">
          <div className="flex w-full justify-between font-pixel text-[11px] tracking-wider">
            <span>PARTY CHESS</span>
            <span>V1.0</span>
          </div>
          <PixelKnight size={112} />
          <h1 className="m-0 font-pixel text-[44px] font-bold leading-none text-pixel-shadow">
            DESPERADO
          </h1>
          <p className="text-[13px] leading-relaxed text-secondary">
            Free-For-All (1 v 1 v 1 v 1) style of chess. 10 minutes to capture as many points as possible. Highest wins. Bounty on highest score player.
          </p>
        </header>

        <div className="dither h-2.5 opacity-60" aria-hidden="true" />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nickname" className="font-pixel text-xs">YOUR NAME</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={MAX_NICKNAME}
            autoComplete="nickname"
            placeholder="e.g. Kate"
            className="h-13 border-2 border-border bg-bg px-3 font-mono text-lg text-main
                       placeholder:text-secondary outline-none focus:bg-main focus:text-bg"
          />
        </div>

        <CreateRoomButton name={nickname} />

        <div className="flex items-center gap-3 font-pixel text-xs text-secondary">
          <div className="h-0.5 flex-1 bg-secondary" aria-hidden="true" />
          <span>OR JOIN FRIENDS</span>
          <div className="h-0.5 flex-1 bg-secondary" aria-hidden="true" />
        </div>

        <JoinRoomForm name={nickname} initialCode={invitedCode} />
      </div>
    </main>
  );
}