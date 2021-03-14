import { Component } from "react";
import axios from "./axios";
export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("this.props.match", this.props.match);
        axios
            .post("/getOtherProfile", { id: this.props.match.params.id })
            .then(({ data }) => {
                if (data.success == false) {
                    this.props.history.push("/");
                } else {
                    // console.log("data getOtherProfile", data);
                    this.setState(data);
                }
            })
            .catch((error) =>
                console.log("Axios Error getOtherProfile", error)
            );
    }
    render() {
        return (
            <div className="Profile">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <img className="fullprofile" src={this.state.imageurl}></img>

                <h3>{this.state.bio}</h3>
            </div>
        );
    }
}
