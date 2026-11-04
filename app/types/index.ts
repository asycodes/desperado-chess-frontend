export type GameMode = "FFA" | "FFA_ECONOMY";

export type Player = {
  id: string;
  nickname: string;
  color: string;
  isHost: boolean;
};