import React from "react";
import axios from "./axios";

export default class BioEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "",
            textArea: false,
            bioDraft: "",
        };
    }
    componentDidMount() {
        console.log("Bioedit mounted");
        // console.log("this.props.bio:", this.props.bio);
        if (this.props.bio) {
            this.setState({
                buttonText: "EDIT",
            });
        } else {
            this.setState({
                buttonText: "ADD",
            });
        }
    }
    handleChange(e) {
        this.setState({ bioDraft: e.target.value });
    }
    handleClick() {
        console.log("SAVE button clicked");
        axios.post("/bioSAVE", this.state).then(({ data }) => {
            if (data.success) {
                this.props.editBio(this.state.bioDraft);
                this.setState({ textArea: false });
            }
        });
    }
    render() {
        return (
            <div>
                <h2>Bio:</h2>
                <h3>{this.props.bio}</h3>

                {!this.state.textArea && (
                    <button
                        onClick={() => {
                            this.setState({ textArea: !this.state.textArea });
                        }}
                    >
                        {this.state.buttonText}
                    </button>
                )}

                {this.state.textArea && (
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    />
                )}
                <br></br>
                {this.state.textArea && (
                    <button onClick={() => this.handleClick()}>SAVE</button>
                )}
            </div>
        );
    }
}
