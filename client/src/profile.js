import ProfilePic from "./profilepic";
import BioEdit from "./bioedit";

export default function Profile({
    first,
    last,
    imageUrl,
    bio,
    toggleUploaderApp,
    editBio,
}) {
    return (
        <div className="Profile">
            <p>
                Profile of {first} {last}
            </p>
            <ProfilePic
                className="fullprofile"
                first={first}
                last={last}
                imageUrl={imageUrl}
                toggleUploaderApp={toggleUploaderApp}
            />
            <BioEdit bio={bio} editBio={(arg) => editBio(arg)} />
        </div>
    );
}
