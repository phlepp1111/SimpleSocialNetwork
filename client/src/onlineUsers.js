import { useSelector, useDispatch } from "react-redux";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    console.log("online:", onlineUsers);
    return (
        <>
            {onlineUsers &&
                onlineUsers.map((onlineUser) => {
                    return (
                        <div key={onlineUser.id}>
                            <img src={onlineUser.imageurl} alt="" />
                            <h1>
                                {onlineUser.first} {onlineUser.last}
                            </h1>
                        </div>
                    );
                })}
        </>
    );
}
