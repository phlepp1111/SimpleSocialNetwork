import axios from "./axios";

export function getFriendConnections() {
    axios.get("/get-friends").then(({ data }) => {
        console.log("DATA from get-friends: ", data);
        return {};
    });
    // return {
    //     type: "UPDATE_STATE_SOMEHOW",
    //     data: 1,
    // };
}
