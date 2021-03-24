import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const online = useSelector((state) => state && state.online);

    console.log("online:", online);
    return (
        <>
            <div className="onlineUsers">
                <h4>currently online:</h4>
                <div className="onlineUsersContainer">
                    {online &&
                        online.map((user) => {
                            return (
                                <div key={user.id}>
                                    <div>
                                        <div className="onlineUsersContainerSmall">
                                            <Link to={`/users/${user.id}`}>
                                                <img
                                                    className="onlineUsersPic"
                                                    src={user.imageurl}
                                                />
                                            </Link>
                                            <p className="mostRecentLink">
                                                {user.first} {user.last}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
