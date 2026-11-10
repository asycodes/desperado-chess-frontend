export type SeatScore = {
  playerId: number;
  name: string;
  position: number;
  bot: boolean;
  score: number;
  leader: boolean;
};

export type BoardState = {
  id: number;
  whiteId: number;
  blackId: number;
  fen: string;
  playerToMove: number;
  turnDeadlineEpochMs: number;
  points: Record<string, number>;
};

export type MatchSnapshot = {
  roomCode: string;
  status: "RUNNING" | "FINISHED";
  endsAtEpochMs: number;
  seats: SeatScore[];
  boards: BoardState[];
};

export type MoveResult = {
  pointsAwarded: number;
  bountyApplied: boolean;
  checkmate: boolean;
};