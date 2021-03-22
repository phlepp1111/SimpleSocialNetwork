import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Reset from "./reset";

export default function Welcome() {
    return (
        <div>
            <h1 className="title">Welcome to the semi-social network</h1>
            <img className="fullprofile" src="geometric dots.gif"></img>
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
