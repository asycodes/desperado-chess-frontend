import { useNavigate } from "react-router";

export function CreateRoomButton() {
    const navigate = useNavigate();
    function handleCreate(){
        // TODO: edit after backend has been setup (generating the room code etc)
        navigate("room/TEST")
    }

    return(
        <button type="button" onClick={handleCreate} className="h-14 rounded-2xl bg-accent text-lg font-semibold text-main transition hover:brightness-110 active:scale-[0.99]">Create Room</button>
    )
}