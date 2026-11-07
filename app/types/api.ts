export type JoinRoomResponse = { code: string; playerId: number };

export type PlayerResponse = {
  id: number;
  nickname: string;
  position: number;
  isHost: boolean;
};

export type RoomResponse = {
  code: string;
  mode: "FFA" | "FFA_ECONOMY";
  active: boolean;
  players: PlayerResponse[];
};

export type NicknameRequest = { nickname: string };