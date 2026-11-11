import { api } from "~/lib/api";
import { subscribeToTopic } from "~/lib/stomp";
import type { JoinRoomResponse, NicknameRequest, RoomResponse, PlayerResponse } from "~/types/api";
import type { GameMode } from "~/types/index";






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

      async onCacheEntryAdded(code, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe: (() => void) | undefined;
        try {
          await cacheDataLoaded; // wait for the first REST response
          unsubscribe = subscribeToTopic(`/topic/rooms/${code.toUpperCase()}`, (body) => {
            updateCachedData(() => body as RoomResponse);
          });
        } catch {
          // the cache entry was removed before the first load finished
        }
        await cacheEntryRemoved; // wait until no component uses this room
        unsubscribe?.();
      },
    }),
    addBot: build.mutation<PlayerResponse, { code: string; requesterId: number }>({
        query: ({ code, requesterId }) => ({
            url: `/rooms/${code}/bots`,
            method: "POST",
            body: { requesterId },
        }),
        invalidatesTags: (_result, _error, { code }) => [{ type: "Room", id: code }],
    }),
    startMatch: build.mutation<RoomResponse, { code: string; requesterId: number; mode: GameMode }>({
        query: ({ code, requesterId, mode }) => ({
            url: `/rooms/${code}/start`,
            method: "POST",
            body: { requesterId, mode },
        }),
    })
  }),
});

export const { useCreateRoomMutation, useJoinRoomMutation, useGetRoomQuery, useAddBotMutation, useStartMatchMutation } = roomApi;