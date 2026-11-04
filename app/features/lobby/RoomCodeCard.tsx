import { useEffect, useState } from "react";

type RoomCodeCardProps = {
    code: string;
}

export function RoomCodeCard({ code }: RoomCodeCardProps){
    const [copied,setCopied]=useState(false);

    useEffect(()=>{

        if(!copied){return;}
        const timer = setTimeout(() => setCopied(false),2000);
        return() => clearTimeout(timer);
    },[copied])

    async function handleCopy() {
        const link = `${window.location.origin}/room/${code}`;
        try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        } catch {
        console.warn("Could not copy invite link");
        }
    }

    return(
        <div className="flex flex-col items-center gap-4 rounded-2xl p-5 border border-border bg-card">
            <h2 className="text-secondary font-bold">Room Code</h2>
            <span className="text-2xl text-accent font-bold">{code}</span>
            <button type ="button" className="rounded-xl border border-border px-4 py-2" onClick={handleCopy}>{copied ? "Copied!" : "Copy invite link"}</button>
            <span aria-live="polite" className="sr-only">{copied ? "Invite link copied to clipboard" : ""}</span>
        </div>
    )
}