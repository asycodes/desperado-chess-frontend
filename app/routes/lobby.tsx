import type { Route } from "./+types/lobby";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Lobby({ params }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [mode, setMode] = useState("Normal")

    function goBack(){
        navigate("/")
    }


    function setNormalMode(){
        setMode("Normal")
    }

    function setEconomyMode(){
        setMode("Economy")
    }
  return(

    
    <main className="min-h-screen bg-bg p-6 text-main">
        <div className="mt-auto flex justify-between text-sm">
            <div className="text-secondary">You are the host</div>
            <button type="button" onClick={goBack} className="h-14 rounded-2xl border border-border text-secondary">{"<"}</button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl p-5 border border-border bg-card">
            <p className="text-secondary font-bold">Room Code</p>
            <span className="text-xl text-accent">{params.code}</span>
            <button className="rounded-2xl border border-border">Copy invite link</button>
        </div>

        <p className="font-bold">Mode</p>
        <div className="flex gap-1 rounded-2xl p-5 border border-border bg-card">
            <button onClick={() => {setMode("Normal")}} className="${mode =='Normal'? bg-white text-black : bg-card text-white}">FFA Mode<br/>Most Points Win</button>
            <button onClick={() => {setMode("Economy")}} className="${mode =='Economy'? bg-white text-black : bg-card text-white}">FFA + Economy mode<br/>Buy pieces with gold</button>
        </div>
    
    </main>
  ) 
}