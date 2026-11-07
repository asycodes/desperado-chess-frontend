import type { Route } from "./+types/home";
import { Link } from "react-router";

import { CreateRoomButton } from "~/features/room/CreateRoomButton";
import { JoinRoomForm } from "~/features/room/JoinRoomForm";
import { useState } from "react";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Desperado Chess" },
    { name: "description", content: "Chess can BE fun" },
  ];
}

const MAX_NICKNAME = 16;


export default function Home(){
  const [nickname,setNickname] = useState("");
  const [searchParams] = useSearchParams();
  const invitedCode = searchParams.get("code")?.toUpperCase() ?? "";
  
  return(
    <main className="min-h-screen bg-bg text-main">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-7 px-6 pb-8 pt-14">
        <header className="flex flex-col gap-3">
          <span className="font-display text-xl font-extrabold">Desperado Chess</span>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">Free-For-All style of Chess with friends!</h1>
          <p className="text-secondary">Capture as many points as possible across all the chessboards</p>
        </header>

        <div className= "flex flex-col gap-2">
          <label htmlFor="nickname" className="text-sm font-semibold">Nickname</label>
          <input id="nickname" autoFocus={invitedCode !== ""} value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={MAX_NICKNAME} placeholder="eg Marcus" className="h-12 rounded-xl border border-border bg-bg px-4 outline-none focus:border-accent"/>
        </div>

        <CreateRoomButton name = {nickname}/>

        <div className="flex items-center gap-3 text-sm text-secondary">
          <div className="h-px flex-1 bg-line"/>
          <span>or join friends</span>
          <div className="h-px flex-1 bg-line"/>
        </div>

        <JoinRoomForm name = {nickname} initialCode={invitedCode}/>

        <footer className="mt-auto flex justify-between text-sm">
          <Link to="/history" className="text-gold hover:underline">My match history</Link>
          <Link to="/how-to-play" className="text-gold hover:underline">How to play</Link>
        </footer>

      </div>
    </main>

  )



}