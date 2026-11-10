import { api } from "~/lib/api";
import { subscribeToTopic } from "~/lib/stomp";
import type { MatchSnapshot, MoveResult } from "~/types/match";

export const matchApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMatch: build.query<MatchSnapshot, string>({
      query: (code) => `/matches/${code}`,
      async onCacheEntryAdded(code, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe: (() => void) | undefined;
        try {
          await cacheDataLoaded;
          unsubscribe = subscribeToTopic(`/topic/matches/${code.toUpperCase()}`, (body) => {
            updateCachedData(() => body as MatchSnapshot);
          });
        } catch {
          // the cache entry was removed before the first load finished
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    makeMove: build.mutation<MoveResult, { code: string; playerId: number; boardId: number; move: string }>({
      query: ({ code, ...body }) => ({ url: `/matches/${code}/moves`, method: "POST", body }),
    }),
  }),
});

export const { useGetMatchQuery, useMakeMoveMutation } = matchApi;