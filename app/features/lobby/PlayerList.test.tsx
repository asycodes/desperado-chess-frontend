import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayerList } from "./PlayerList";
import type { Player } from "~/types";

const host: Player = { id: 1, nickname: "kate", position: 1, isBot: false, isHost: true };
const bot: Player = { id: 2, nickname: "Bot 1", position: 2, isBot: true, isHost: false };

describe("PlayerList", () => {
  it("shows players in their seats and fills the rest with waiting slots", () => {
    render(<PlayerList players={[host, bot]} currentPlayerId={1} />);

    expect(screen.getByText("kate")).toBeInTheDocument();
    expect(screen.getByText("Bot 1")).toBeInTheDocument();
    expect(screen.getAllByText("Waiting for player…")).toHaveLength(2);
  });

  it("labels the host, the bot and the current player", () => {
    render(<PlayerList players={[host, bot]} currentPlayerId={1} />);

    expect(screen.getByText("Host · You")).toBeInTheDocument();
    expect(screen.getByText("Bot")).toBeInTheDocument();
  });

  it("shows no add-bot buttons without a handler", () => {
    render(<PlayerList players={[host]} currentPlayerId={1} />);
    expect(screen.queryByRole("button", { name: /add bot/i })).not.toBeInTheDocument();
  });

  it("calls onAddBot when the host clicks an add-bot button", async () => {
    const onAddBot = vi.fn();
    render(<PlayerList players={[host]} currentPlayerId={1} onAddBot={onAddBot} />);

    await userEvent.click(screen.getAllByRole("button", { name: /add bot/i })[0]);
    expect(onAddBot).toHaveBeenCalledTimes(1);
  });
});