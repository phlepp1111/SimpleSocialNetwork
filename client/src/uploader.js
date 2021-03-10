import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Uploader mounted");
    }
    methodInUploader() {
        this.props.methodInApp("cool stuff!");
    }
    render() {
        return (
            <div>
                <h2>Uploader Component</h2>
                <h2 onClick={() => this.methodInUploader()}>
                    click here to run a method uploader
                </h2>
            </div>
        );
    }
}
