import React from "react";
import axios from "axios";
export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        console.log("handleChange running");
        console.log(e.target.name);
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
                if (data.success === true) {
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
            <div>
                <h1>Welcome to foebook</h1>
                <h1>Register Here</h1>
                {this.state.error && <p>something went wrong</p>}
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
                <input
                    type="hidden"
                    name="_csrf"
                    value="<%= csrfToken %>"
                ></input>
                <button onClick={(e) => this.handleClick(e)}>Submit</button>
                <br></br>
                <p>
                    if you already registered, why dont you{" "}
                    <a href="/"> log in here.</a>
                </p>
            </div>
        );
    }
}
