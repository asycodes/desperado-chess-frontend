import type { Route } from "./+types/lobby";

export default function Lobby({ params }: Route.ComponentProps) {
  return <main className="min-h-screen bg-ground p-6 text-ink">Lobby for {params.code}</main>;
}