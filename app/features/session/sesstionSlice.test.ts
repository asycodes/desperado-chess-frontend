import reducer, { joinedRoom, leftRoom } from "./sessionSlice";

describe("sessionSlice", () => {
  const empty = { code: null, playerId: null, nickname: null };

  it("stores the room and player after joining", () => {
    const state = reducer(empty, joinedRoom({ code: "ABCD", playerId: 10, nickname: "kate" }));
    expect(state).toEqual({ code: "ABCD", playerId: 10, nickname: "kate" });
  });

  it("clears everything after leaving", () => {
    const joined = { code: "ABCD", playerId: 10, nickname: "kate" };
    expect(reducer(joined, leftRoom())).toEqual(empty);
  });
});