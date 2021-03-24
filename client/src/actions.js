import axios from "./axios";

export async function getFriendConnections() {
    const { data } = await axios.get("/get-friends");
    return {
        type: "GET_LIST",
        friendsList: data,
    };
}
export async function acceptFriend(id) {
    await axios.post("/addFriend", {
        otherUser: id,
        friendlyAction: "ACCEPT FRIEND",
    });
    return {
        type: "ACCEPT_FRIEND",
        id: id,
    };
}
export async function unfriend(id) {
    await axios.post("/addfriend", {
        otherUser: id,
        friendlyAction: "UNFRIEND",
    });
    return {
        type: "UNFRIEND_FRIEND",
        id: id,
    };
}
export async function chatMessages(msgs) {
    return {
        type: "MOST_RECENT_CHAT",
        data: msgs,
    };
}

export async function chatMessage(msg) {
    return {
        type: "CHAT_MESSAGE",
        data: msg,
    };
}
export async function onlineUsers(users) {
    console.log(`users in action`, users);
    return {
        type: "ONLINE_USERS",
        online: users,
    };
}
