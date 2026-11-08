import { api } from "~/lib/api";
import type { JoinRoomResponse, NicknameRequest, RoomResponse, PlayerResponse } from "~/types/api";
import type {GameMode} from "~/types/index";
import { Client } from "@stomp/stompjs";






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
            const client = new Client({
            brokerURL: import.meta.env.VITE_WS_URL,
            reconnectDelay: 3000,
            });

            try {
            await cacheDataLoaded; //to wait for the first REST res

            client.onConnect = () => {
                client.subscribe(`/topic/rooms/${code.toUpperCase()}`, (message) => {
                const room = JSON.parse(message.body) as RoomResponse;
                updateCachedData(() => room);
                });
            };
            client.activate();
            } catch {
            // the cache entry was removed before the first load finished
            }

            await cacheEntryRemoved; //wait till no component uses the room
            await client.deactivate();
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