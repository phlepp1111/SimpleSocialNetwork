import { Component } from "react";
import axios from "./axios";
import { FriendButton } from "./friendButton";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match", this.props.match);
        axios
            .post("/getOtherProfile", { id: this.props.match.params.id })
            .then(({ data }) => {
                console.log("data otherprofile:", data);
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
                <FriendButton id={this.props.match.params.id}></FriendButton>
                <br></br>
                <img
                    className="fullprofile"
                    src={this.state.imageurl || "default.png"}
                ></img>
                <br></br>
                <h3>{this.state.bio}</h3>
            </div>
        );
    }
}
