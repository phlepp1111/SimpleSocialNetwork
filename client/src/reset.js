import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor() {
        super();
        this.state = {
            step: 1,
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
            () => console.log("this.state after setState: ", this.state)
        );
    }
    handleClick1() {
        console.log("clicked");
        axios
            .post("/reset1", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ step: 2, error: false });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Axios POST Error on /reset1: ", error);
            });
    }

    handleClick2() {
        console.log("clicked");
        axios
            .post("/reset2", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ step: 3, error: false });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Axios POST Error on /reset2: ", error);
            });
    }

    render() {
        let { step } = this.state;
        if (step === 1) {
            return (
                <div>
                    <h1>Reset your Password here</h1>
                    {this.state.error && (
                        <p className="errorMessage">something went wrong</p>
                    )}
                    <input
                        name="email"
                        placeholder="enter your email adress here"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <button onClick={() => this.handleClick1()}>Submit</button>
                    <br></br>
                    <p>
                        if you have not registered yet, you can{" "}
                        <Link to="/"> register here.</Link>
                    </p>
                </div>
            );
        } else if (step === 2) {
            return (
                <div>
                    <h1>Ok! We have sent a Reset Code to your email address</h1>
                    {this.state.error && (
                        <p className="errorMessage">
                            Please check the Reset Code again
                        </p>
                    )}
                    <input
                        name="resetCode"
                        key="resetCode"
                        placeholder="Reset Code"
                        onChange={(e) => this.handleChange(e)}
                    />

                    <input
                        name="newPassword"
                        key="newPassword"
                        placeholder="New Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.handleClick2()}>
                        Reset Your Password
                    </button>
                </div>
            );
        } else if (step === 3) {
            return (
                <div>
                    <h1>Looks like everything worked out!</h1>
                    <button className="submitButton">
                        <Link to="/login">Continue to login</Link>
                    </button>
                    {this.state.error && (
                        <p className="errorMessage">
                            Something went wrong, please try again
                        </p>
                    )}
                </div>
            );
        }
    }
}
