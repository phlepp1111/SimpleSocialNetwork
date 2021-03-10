export default function ProfilePic({ first, last, imageUrl }) {
    // console.log("props being passed from App: ", props);
    imageUrl = imageUrl || "default.png";
    return (
        <div>
            <h2>
                Pic of {first} {last} here
            </h2>
            <img
                width="200px"
                heigt="200px"
                src={imageUrl}
                alt={first + last}
            />
        </div>
    );
}
