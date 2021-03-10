import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Miro",
            last: "Hund",
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        console.log("App mounted");
        //GET user Info
    }
    toggleUploader() {
        console.log("toggleUploader running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    methodInApp(arg) {
        console.log("methodInApp is running with arg:", arg);
    }
    render() {
        return (
            <div>
                <h1>Hello from APP</h1>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
                <h2 onClick={() => this.toggleUploader()}>
                    Toggling uploader Visibility
                </h2>
                {this.state.uploaderIsVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
