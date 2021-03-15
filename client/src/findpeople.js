import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState();
    const [resultUsers, setResultUsers] = useState();
    const [resultUsersSearch, setResultUsersSearch] = useState();

    useEffect(function () {
        axios.post("/users/most-recent").then(({ data }) => {
            console.log("most recent data:", data);
            setResultUsers(data.users);
        });
    }, []);

    useEffect(
        function () {
            axios
                .get(`/users/${searchTerm}`)
                .then(({ data }) => {
                    console.log("search result: ", data);
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
            {resultUsers &&
                resultUsers.map(function (user) {
                    return (
                        <div key={user.id}>
                            <Link
                                className="mostRecentLink"
                                to={`/users/${user.id}`}
                            >
                                <div className="mostRecentContainer">
                                    <img
                                        className="mostRecentImage"
                                        src={user.imageurl}
                                    />
                                    <p>{user.first}</p>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            <input
                placeholder="enter name here"
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
                                    {user.last} {user.first}
                                </p>
                            </Link>
                        </div>
                    );
                })}
        </div>
    );
}
