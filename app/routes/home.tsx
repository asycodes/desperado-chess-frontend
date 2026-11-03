import type { Route } from "./+types/home";
import { Link } from "react-router";

import { CreateRoomButton } from "~/features/CreateRoomButton";
import { JoinRoomForm } from "~/features/JoinRoomForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Desperado Chess" },
    { name: "description", content: "Chess can BE fun" },
  ];
}

export default function Home(){
  return(
    <main className="min-h-screen bg-bg text-main">
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-7 px-6 pb-8 pt-14">
        <header className="flex flex-col gap-3">
          <span className="font-display text-xl font-extrabold">Desperado Chess</span>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">Free-For-All style of Chess with friends!</h1>
          <p className="text-secondary">Capture as many points as possible across all the chessboards</p>
        </header>

        <CreateRoomButton/>

        <div className="flex items-center gap-3 text-sm text-secondary">
          <div className="h-px flex-1 bg-line"/>
          <span>or join friends</span>
          <div className="h-px flex-1 bg-line"/>
        </div>

        <JoinRoomForm/>

      </div>
    </main>

  )



}