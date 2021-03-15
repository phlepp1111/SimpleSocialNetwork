import { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState();
    const [resultUsers, setResultUsers] = useState();

    useEffect(function () {
        axios.post("/users/most-recent").then(({ data }) => {
            console.log("most recent data:", data);
            setResultUsers(data.users);
        });
    }, []);

    useEffect(
        function () {
            axios.get("/user/" + searchTerm);
        },
        [searchTerm]
    );

    return (
        <div className="findpeople">
            {resultUsers &&
                resultUsers.map(function (user) {
                    return (
                        <div key={user.id}>
                            <img className="mostRecent" src={user.imageurl} />
                            <p>{user.first}</p>
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
        </div>
    );
}
