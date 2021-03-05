import React from "react";
export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
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
    render() {
        return (
            <div>
                <h1>Registration</h1>
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
                <button>Submit</button>
            </div>
        );
    }
}
