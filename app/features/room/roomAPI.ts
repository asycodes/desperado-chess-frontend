import { api } from "~/lib/api";
import type { JoinRoomResponse, NicknameRequest, RoomResponse } from "~/types/api";

export const roomApi = api.injectEndpoints({
  endpoints: (build) => ({
    createRoom: build.mutation<JoinRoomResponse, NicknameRequest>({
      query: (body) => ({ url: "/rooms", method: "POST", body }),
    }),
    joinRoom: build.mutation<JoinRoomResponse, { code: string } & NicknameRequest>({
      query: ({ code, nickname }) => ({
        url: `/rooms/${code}/players`,
        method: "POST",
        body: { nickname },
      }),
      invalidatesTags: (_result, _error, { code }) => [{ type: "Room", id: code }],
    }),
    getRoom: build.query<RoomResponse, string>({
      query: (code) => `/rooms/${code}`,
      providesTags: (_result, _error, code) => [{ type: "Room", id: code }],
    }),
  }),
});

export const { useCreateRoomMutation, useJoinRoomMutation, useGetRoomQuery } = roomApi;