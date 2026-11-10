import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateRoomMutation } from "./roomAPI";
import { joinedRoom } from "~/features/session/sessionSlice";
import { useAppDispatch } from "~/store/hooks";
import { getErrorMessage } from "~/lib/errors";

type CreateRoomButtonProps = {
  name: string;
};

const MAX_NICKNAME = 16;

export function CreateRoomButton({ name }: CreateRoomButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    const nickname = name.trim();
    if (nickname.length === 0 || nickname.length > MAX_NICKNAME) {
      setError(`Name must be 1–${MAX_NICKNAME} characters`);
      return;
    }
    setError(null);
    try {
      const result = await createRoom({ nickname }).unwrap();
      dispatch(joinedRoom({ code: result.code, playerId: result.playerId, nickname }));
      navigate(`/room/${result.code}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleCreate}
        disabled={isLoading}
        className="flex h-14 items-center justify-center gap-2 bg-main font-pixel text-xl text-bg pixel-shadow
                   transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                   disabled:cursor-wait disabled:opacity-60"
      >
        <span aria-hidden="true">▶</span>
        {isLoading ? "CREATING…" : "CREATE ROOM"}
      </button>

      {error && (
        <p role="alert" className="flex items-start gap-2 border-2 border-main px-3 py-2 font-pixel text-xs">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}