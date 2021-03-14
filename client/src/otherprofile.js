import { Component } from "react";
import axios from "./axios";
export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match", this.props.match);
        // if (this.props.match.params.id == req.session.userId) {
        //     this.props.history.push("/");
        // }
    }
    render() {
        return <h1>I am the other profile</h1>;
    }
}
