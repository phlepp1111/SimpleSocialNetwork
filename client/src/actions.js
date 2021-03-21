import axios from "./axios";

export async function getFriendConnections() {
    const { data } = await axios.get("/get-friends");
    return {
        type: "GET_LIST",
        friendsList: data,
    };
}
export async function acceptFriend(id) {
    await axios.post("/accept-friend", { otherUser: id });
    return {
        type: "ACCEPT_FRIEND",
        id: id,
    };
}
export async function unfriend(id) {
    await axios.post("/unfriend-friend", { otherUser: id });
    return {
        type: "UNFRIEND_FRIEND",
        id: id,
    };
}
