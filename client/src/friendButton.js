import { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton({ id }) {
    let [button, setButton] = useState();

    function handleClick() {
        console.log("clicked on friend request");
        axios
            .post("/addFriend", { friendlyAction: button, otherUser: id })
            .then(({ data }) => {
                // console.log("db response: ", data);
                setButton(buttonStatus(data));
            })
            .catch((error) => console.log("error requestfriend :", error));
    }

    function buttonStatus(friendshipStatus) {
        let buttonText = "ADD FRIEND";
        if (friendshipStatus.rows) {
            // console.log("FRIENDSHIPSTATUS", friendshipStatus);
            const { sender_id, accepted } = friendshipStatus.rows;
            if (accepted === true) {
                buttonText = "UNFRIEND";
                return buttonText;
            } else if (sender_id == friendshipStatus.loggedInUser) {
                buttonText = "CANCEL REQUEST";
                return buttonText;
            } else if (!accepted) {
                buttonText = "ACCEPT REQUEST";
                return buttonText;
            } else {
                return buttonText;
            }
        } else {
            return buttonText;
        }
    }
    useEffect(
        function () {
            axios
                .post("/friends/" + id)
                .then(({ data }) => {
                    // console.log("FriendshipStatus data:", data);
                    setButton(buttonStatus(data));
                })
                .catch((error) =>
                    console.log("error getting friendship status: ", error)
                );
        },
        [id, button]
    );
    return (
        <div>
            <button onClick={() => handleClick()}>{button}</button>
        </div>
    );
}
