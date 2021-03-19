import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getFriendConnections } from "./action";

export default function GetFriends() {
    const dispatch = useDispatch();
    console.log("Hello from Get-friends:");

    useEffect(() => {
        dispatch(getFriendConnections());
    }, []);

    return (
        <div>
            <h1>get-friends here</h1>
        </div>
    );
}
