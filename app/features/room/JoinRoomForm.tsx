import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useJoinRoomMutation } from "./roomAPI";
import { useAppDispatch } from "~/store/hooks";
import { getErrorMessage } from "~/lib/errors";
import { joinedRoom } from "../session/sessionSlice";

const CODE_PATTERN = /^[A-Z]{4}$/;
const MAX_NICKNAME = 16;

type Props = { name: string; initialCode?: string };



export function JoinRoomForm({ name,initialCode="" }: Props){
    const navigate = useNavigate();
    const [code, setCode] = useState(initialCode);
    const [error,setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [joinRoom, { isLoading }] = useJoinRoomMutation();



    async function handleSubmit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const nickname = name.trim();
        if (!CODE_PATTERN.test(code)){
            setError("Room Code is 4 letters such as ABCD");
            return;
        }
        if (nickname.length > MAX_NICKNAME || nickname.length ==0){
            setError(`Name length must be between 1-${MAX_NICKNAME} characters`);
            return;
        }
        setError(null);
        try {
            const result = await joinRoom({ code, nickname: name }).unwrap();
            dispatch(joinedRoom({ code: result.code, playerId: result.playerId, nickname: name }));
            navigate(`/room/${result.code}`);
        } 
        catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return(
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="room-code" className="text-sm font-semibold">Room Code</label>
                <input id="room-code" value = {code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0,4))}
                autoComplete="off" autoCapitalize="characters" inputMode="text" className="h-14 rounded-xl border border-line bg-ground text-center font-mono text-3xl font-bold tracking-[0.4em] outline-none focus:border-accebt"/>
            </div>
            <button type="submit" disabled={isLoading} className="h-13 rounded-xl border border-ink font-semibold transition hover:bg-ink hover:text-bg">
                {isLoading ? "Joining…" : "Join room"}</button>
            {error && (<p role="alert" className="text-sm text-red-300">{error}</p>)}
        </form>
    )

}