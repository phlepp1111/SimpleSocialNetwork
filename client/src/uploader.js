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
    handleChange(e) {
        // console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }
    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        // console.log("FormData when uploading img: ", formData);
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                if (data.success) {
                    console.log("data", data);
                    this.props.uploadModule(data.imageUrl);
                    this.props.toggleUploaderApp();
                } else {
                    console.log("uploadImage error");
                    // this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log("err in axios post / uploadImage", err);
            });
    }

    toggleUploader() {
        // console.log("this.props: ", this.props);
        this.props.toggleUploaderApp();
    }
    render() {
        return (
            <div>
                <h2>Upload a new profile image here</h2>
                <form>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button onClick={(e) => this.uploadImage(e)}>Submit</button>
                </form>
            </div>
        );
    }
}
