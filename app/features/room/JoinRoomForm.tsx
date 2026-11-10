import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useJoinRoomMutation } from "./roomAPI";
import { useAppDispatch } from "~/store/hooks";
import { getErrorMessage } from "~/lib/errors";
import { joinedRoom } from "~/features/session/sessionSlice";

const CODE_PATTERN = /^[A-Z]{4}$/;
const MAX_NICKNAME = 16;

type JoinRoomFormProps = { name: string; initialCode?: string };

export function JoinRoomForm({ name, initialCode = "" }: JoinRoomFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [joinRoom, { isLoading }] = useJoinRoomMutation();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nickname = name.trim();

    if (!CODE_PATTERN.test(code)) {
      setError("Room codes are 4 letters, like ABCD");
      return;
    }
    if (nickname.length === 0 || nickname.length > MAX_NICKNAME) {
      setError(`Name must be 1–${MAX_NICKNAME} characters`);
      return;
    }

    setError(null);
    try {
      const result = await joinRoom({ code, nickname }).unwrap();
      dispatch(joinedRoom({ code: result.code, playerId: result.playerId, nickname }));
      navigate(`/room/${result.code}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="room-code" className="font-pixel text-xs">ROOM CODE</label>
          <input
            id="room-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4))}
            autoComplete="off"
            autoCapitalize="characters"
            inputMode="text"
            className="h-13 border-2 border-border bg-bg text-center font-mono text-[26px] font-bold tracking-[0.35em]
                       text-main outline-none focus:bg-main focus:text-bg"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-13 border-2 border-main font-pixel text-lg text-main pixel-shadow-sm
                     transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "…" : "JOIN"}
        </button>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 border-2 border-main px-3 py-2 font-pixel text-xs">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </form>
  );
}