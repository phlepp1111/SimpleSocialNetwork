import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import GetFriends from "./getFriends";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState();
    const [resultUsers, setResultUsers] = useState();
    const [resultUsersSearch, setResultUsersSearch] = useState();

    useEffect(function () {
        axios.post("/users/most-recent").then(({ data }) => {
            // console.log("most recent data:", data);
            setResultUsers(data.users);
        });
    }, []);

    useEffect(
        function () {
            axios
                .post(`/users/${searchTerm}`)
                .then(({ data }) => {
                    // console.log("search result: ", data);
                    setResultUsersSearch(data);
                })
                .catch((error) => {
                    console.log("something went wrong with the search", error);
                });
        },
        [searchTerm]
    );

    return (
        <div className="findpeople">
            <div className="people">
                <GetFriends />

                <h3>newest members:</h3>
                <div className="friendDiv">
                    {resultUsers &&
                        resultUsers.map(function (user) {
                            return (
                                <div className="friendDivSmall" key={user.id}>
                                    <Link
                                        className="mostRecentLink"
                                        to={`/users/${user.id}`}
                                    >
                                        <div className="mostRecentContainer">
                                            <img
                                                className="mostRecentImage"
                                                src={
                                                    user.imageurl ||
                                                    "default.png"
                                                }
                                            />
                                            <p>
                                                {user.first} {user.last}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
                <input
                    placeholder="find other users here"
                    defaultValue={searchTerm}
                    onChange={({ target }) => {
                        setSearchTerm(target.value);
                    }}
                />
                <br />
                {resultUsersSearch &&
                    resultUsersSearch.map(function (user) {
                        return (
                            <div key={user.id}>
                                <Link
                                    className="mostRecentLink"
                                    to={`/users/${user.id}`}
                                >
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
