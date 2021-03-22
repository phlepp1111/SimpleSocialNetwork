import { useEffect, useRef } from "react";
import { socket } from "./sockets";
import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();
    // useEffect(() => {
    //     console.log("chat mounted");
    //     console.log("elemRef.current:", elemRef.current);
    //     console.log("elemRef.current.SCROLLTOP:", elemRef.current.scrollTop);
    //     console.log(
    //         "elemRef.current..SCROLLHEIGHT:",
    //         elemRef.current.scrollHeight
    //     );
    //     console.log(
    //         "elemRef.current.CLIENTHEIGHT:",
    //         elemRef.current.clientHeight
    //     );

    //     const newScrollTop =
    //         elemRef.current.scrollHeight - elemRef.current.clientHeight;
    //     elemRef.current.scrollTop = newScrollTop;
    // }, []);

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
            <div ref={elemRef}>
                <h1>Chat room</h1>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
                <p>Chat message here</p>
            </div>
        </>
    );
}
