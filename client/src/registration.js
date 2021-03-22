import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        console.log("handleChange running");
        // console.log(e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state) //callback fn because setState is async
        );
    }
    handleClick() {
        console.log("clicked");
        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                //IF-ELSE Statement.
                if (data.success) {
                    location.replace("/");
                } else {
                    //render error
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Axios POST Error on /registration: ", error);
            });
    }
    render() {
        return (
            <div className="title">
                <h1>Register Here</h1>
                {this.state.error && (
                    <p className="errorMessage">something went wrong</p>
                )}
                <input
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.handleClick()}>Submit</button>
                <br></br>
                <p>
                    if you already registered, why dont you{" "}
                    <Link to="/login"> log in here.</Link>
                </p>
            </div>
        );
    }
}
