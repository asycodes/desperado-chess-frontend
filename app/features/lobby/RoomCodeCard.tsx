import { useEffect, useState } from "react";

type RoomCodeCardProps = { code: string };
type CopyStatus = "idle" | "copied" | "failed";

export function RoomCodeCard({ code }: RoomCodeCardProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const inviteLink = `${window.location.origin}/?code=${code}`;

  useEffect(() => {
    if (status !== "copied") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section className="flex flex-col items-center gap-4 border-2 border-main bg-card p-5 pixel-shadow">
      <h2 className="m-0 font-pixel text-xs text-secondary">ROOM CODE</h2>

      <div className="flex gap-2" aria-label={`Room code ${code.split("").join(" ")}`}>
        {code.split("").map((letter, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="flex h-14 w-12 items-center justify-center bg-main font-pixel text-3xl font-bold text-bg"
          >
            {letter}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`flex h-11 w-full items-center justify-center gap-2 border-2 border-main font-pixel text-sm pixel-shadow-sm
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          ${status === "copied" ? "bg-main text-bg" : "text-main"}`}
      >
        <span aria-hidden="true">{status === "copied" ? "✓" : "⧉"}</span>
        {status === "copied" ? "COPIED!" : "COPY INVITE LINK"}
      </button>

      {status === "failed" && (
        <div className="flex w-full flex-col gap-1.5">
          <p className="m-0 font-pixel text-[11px] text-secondary">! COULDN'T COPY. SHARE THIS LINK:</p>
          <input
            readOnly
            value={inviteLink}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Invite link"
            className="h-10 w-full border-2 border-dashed border-main bg-bg px-2 font-mono text-xs text-main outline-none"
          />
        </div>
      )}

      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Invite link copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </span>
    </section>
  );
}