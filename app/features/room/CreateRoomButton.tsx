import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateRoomMutation } from "./roomAPI";
import { joinedRoom } from "~/features/session/sessionSlice";
import { useAppDispatch } from "~/store/hooks";
import { getErrorMessage } from "~/lib/errors";

type PlayerName = {
    name: string
}
const MAX_NICKNAME = 16;


export function CreateRoomButton({ name }: PlayerName) {
    const navigate = useNavigate();
    const [error,setError] = useState<null | String>(null);
    const dispatch = useAppDispatch();
    const [createRoom, { isLoading }] = useCreateRoomMutation();


    async function handleCreate(){
        if (name.length > MAX_NICKNAME || name.length ==0){
                setError(`Name length must be between 1-${MAX_NICKNAME} characters`);
                return;
            }
        setError(null);
        try {
            const result = await createRoom({ nickname: name }).unwrap();
            dispatch(joinedRoom({ code: result.code, playerId: result.playerId, nickname: name }));
            navigate(`/room/${result.code}`);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return(
        <div className="flex flex-col gap-2">
        <button type="button" disabled={isLoading} onClick={handleCreate} className="h-14 rounded-2xl bg-accent text-lg font-semibold text-main transition hover:brightness-110 active:scale-[0.99]">{isLoading ? "Creating…" : "Create a room"}</button>
        {error && (<p role="alert" className="text-sm text-red-300">{error}</p>)}

        </div>
        
    )
}