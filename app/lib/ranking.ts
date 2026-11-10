// just a ranking placement script
export function competitionRanks(scores: number[]): number[] {
  const sorted = [...scores].sort((a, b) => b - a);
  return scores.map((s) => sorted.indexOf(s) + 1);
}