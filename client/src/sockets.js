import { chatMessages, chatMessage, onlineUsers } from "./actions";
import { io } from "socket.io-client";
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("userConnected", (data) => {
            console.log("data in socket.js", data);
        });
        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));

        socket.on("onlineUsers", (online) =>
            store.dispatch(onlineUsers(online))
        );
    }
};
