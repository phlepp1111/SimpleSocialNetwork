import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <img src="emoji.jpg"></img>;
}
ReactDOM.render(elem, document.querySelector("main"));
