import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import GetFriends from "./getFriends";
import Chat from "./chat";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        console.log("App mounted");
        axios
            .get("/profile-info")
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        first: data.first,
                        last: data.last,
                        imageUrl: data.imageUrl,
                        bio: data.bio,
                    });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("error in axios get / profile-info", error);
            });
    }
    toggleUploaderApp() {
        console.log("toggleUploader running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    homeProfile() {}
    uploadModule(imageUrl) {
        console.log("uploadModule is running. argument passed:", imageUrl);
        this.setState({
            imageUrl: imageUrl,
        });
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Link to="/users">
                        <img className="Logo" src="../geometric dots.gif"></img>
                    </Link>
                    <Link to="/chat">
                        <img
                            className="ChatLogo"
                            src="https://media.giphy.com/media/xThuWtNFKZWG6fUFe8/giphy.gif"
                        ></img>
                    </Link>
                    <Link to="/logout">
                        <img className="Logout" src="default.png"></img>
                    </Link>
                    <h1 className="title">Semi-social network</h1>
                    <ProfilePic
                        className="smallprofile"
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        toggleUploaderApp={() => this.toggleUploaderApp()}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                toggleUploaderApp={() =>
                                    this.toggleUploaderApp()
                                }
                                editBio={(bio) => this.setState({ bio: bio })}
                            />
                        )}
                    />

                    <Route
                        exact
                        path="/users/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route exact path="/users" render={() => <FindPeople />} />
                    <Route
                        exact
                        path="/get-friends"
                        render={() => <GetFriends />}
                    />
                    <Route path="/chat" component={Chat} />

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleUploaderApp={() => this.toggleUploaderApp()}
                            uploadModule={(imageUrl) =>
                                this.uploadModule(imageUrl)
                            }
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
