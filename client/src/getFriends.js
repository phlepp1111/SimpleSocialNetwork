import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getFriendConnections, unfriend, acceptFriend } from "./actions";

export default function GetFriends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendConnections());
    }, []);

    const friend = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted == true)
    );
    console.log("friend in getfriends:", friend);
    const wannabe = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(
                (wannabe) =>
                    (wannabe.accepted == false) &
                    (wannabe.id == wannabe.sender_id)
            )
    );
    console.log("wannabe in getfriends:", wannabe);
    const requestSent = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(
                (requestSent) =>
                    (requestSent.accepted == false) &
                    (requestSent.id == requestSent.recipient_id)
            )
    );
    console.log("requestSent in getfriends: ", requestSent);
    if (!friend && !wannabe && !requestSent) {
        return null;
    }
    return (
        <div>
            <br></br>
            <h3>all your friends here:</h3>
            <br></br>{" "}
            <div className="friendDiv">
                {wannabe.map((friend, index) => (
                    <div className="friendDivSmall" key={index}>
                        <Link
                            className="mostRecentLink"
                            to={`/users/${friend.id}`}
                        >
                            <img
                                className="mostRecentImage"
                                src={friend.imageurl || "default.png"}
                            ></img>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                        </Link>
                        <button
                            onClick={() => dispatch(acceptFriend(friend.id))}
                        >
                            ACCEPT REQUEST
                        </button>
                    </div>
                ))}
            </div>
            <div className="friendDiv">
                {requestSent.map((friend, index) => (
                    <div className="friendDivSmall" key={index}>
                        <Link
                            className="mostRecentLink"
                            to={`/users/${friend.id}`}
                        >
                            <img
                                className="mostRecentImage"
                                src={friend.imageurl || "default.png"}
                            ></img>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                        </Link>
                        <button onClick={() => dispatch(unfriend(friend.id))}>
                            CANCEL REQUEST
                        </button>
                    </div>
                ))}
            </div>
            <div className="friendDiv">
                {friend.map((friend, index) => (
                    <div className="friendDivSmall" key={index}>
                        <Link
                            className="mostRecentLink"
                            to={`/users/${friend.id}`}
                        >
                            <img
                                className="mostRecentImage"
                                src={friend.imageurl || "default.png"}
                            ></img>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                        </Link>
                        <button onClick={() => dispatch(unfriend(friend.id))}>
                            UNFRIEND
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
