import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        // console.log(e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    handleClick() {
        console.log("handleClick state data:", this.state);
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                this.setState({ error: true });
                console.log("error in Axios after login submit:", error);
            });
    }

    render() {
        return (
            <div className="login">
                <h1>Login Here:</h1>
                <h3>
                    Or <Link to="/">Register Here</Link>
                </h3>
                {this.state.error && (
                    <p className="errorMessage">
                        `Are you sure you already registered?`
                    </p>
                )}
                <input
                    name="email"
                    placeholder="Email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <button onClick={() => this.handleClick()}>Login</button>
                <br />
                <p>
                    Forgot your password? <Link to="/reset">Reset it here</Link>
                </p>
            </div>
        );
    }
}
