import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";

const CODE_PATTERN = /^[A-Z]{4}$/;
const MAX_NICKNAME = 16;



export function JoinRoomForm(){
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [nickname,setNickname] = useState("");
    const [error,setError] = useState<string | null>(null);
    function handleSubmit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const name = nickname.trim();
        if (!CODE_PATTERN.test(code)){
            setError("Room Code is 4 letters such as ABCD");
            return;
        }
        if (name.length > MAX_NICKNAME || name.length ==0){
            setError("Name length must be between 1-${MAX_NICKNAME} characters");
            return;
        }
        setError(null);
        // TODO: call the join-room API, store nickname + token in sessionSlice.
        navigate(`/room/${code}`)
    }

    return(
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="room-code" className="text-sm font-semibold">Room Code</label>
                <input id="room-code" value = {code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0,4))}
                autoComplete="off" autoCapitalize="characters" inputMode="text" className="h-14 rounded-xl border border-line bg-ground text-center font-mono text-3xl font-bold tracking-[0.4em] outline-none focus:border-accebt"/>
            </div>

            <div className= "flex flex-col gap-2">
                <label htmlFor="nickname" className="text-sm font-semibold">Nickname</label>
                <input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={MAX_NICKNAME} placeholder="eg Marcus" className="h-12 rounded-xl border border-border bg-bg px-4 outline-none focus:border-accent"/>
            </div>

            {error && (<p role="alert" className="text-sm text-red-300">{error}</p>)}
            <button type="submit" className="h-13 rounded-xl border border-ink font-semibold transition hover:bg-ink hover:text-bg">
                Join room</button>
        </form>
    )

}