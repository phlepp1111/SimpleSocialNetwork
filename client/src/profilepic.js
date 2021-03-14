import { Link } from "react-router-dom";
export default function ProfilePic({
    first,
    last,
    imageUrl,
    toggleUploaderApp,
    className,
}) {
    // console.log("props being passed from App: ", props);
    imageUrl = imageUrl || "https://picsum.photos/200/200?grayscale&blur";
    return (
        <div>
            <Link to="/" className="LinkHome">
                <img
                    className={className}
                    onDoubleClick={toggleUploaderApp}
                    src={imageUrl}
                    alt={first + " " + last}
                />
            </Link>
        </div>
    );
}
