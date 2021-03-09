import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to foebook</h1>
            <img src="emoji.jpg"></img>
            <HashRouter>
                <div>
                    <Route exact path="/register" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
