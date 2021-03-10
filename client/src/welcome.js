import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Reset from "./reset";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to foebook</h1>
            <img src="emoji.jpg"></img>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </div>
            </HashRouter>
        </div>
    );
}
