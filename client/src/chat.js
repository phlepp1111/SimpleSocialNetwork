import { useEffect, useRef } from "react";
import { socket } from "./sockets";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineUsers";
console.log("onlineUsers:", OnlineUsers);
export default function Chat() {
    const chatMessages = useSelector((state) => state && state.messages);
    console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();
    useEffect(() => {
        const newScrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        elemRef.current.scrollTop = newScrollTop;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value: ", e.target.value);
            socket.emit("my amazing chat message", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <>
            <div className="Chat" id="chatMessages">
                <div className="ChatSmall">
                    <h1>Chat room</h1>
                    <OnlineUsers />
                    <div className="ChatContainer" ref={elemRef}>
                        {chatMessages &&
                            chatMessages.map((chatMessages, index) => (
                                <div className="chatMessage" key={index}>
                                    <p>
                                        {chatMessages.first} {chatMessages.last}
                                    </p>
                                    <p className="chatText">
                                        <Link
                                            to={`/users/${chatMessages.sender_id}`}
                                        >
                                            <img
                                                className="ChatPic"
                                                src={chatMessages.imageurl}
                                            ></img>
                                        </Link>{" "}
                                        {chatMessages.chat_message}
                                    </p>
                                    <p className="createdAt">
                                        {chatMessages.created_at.slice(0, 10)}{" "}
                                        {chatMessages.created_at.slice(12, 16)}
                                    </p>
                                </div>
                            ))}
                    </div>
                    <textarea
                        onKeyDown={keyCheck}
                        placeholder="enter chat message here"
                    ></textarea>
                </div>
            </div>
        </>
    );
}
