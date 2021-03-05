export default function Greetee(props) {
    console.log("Props in Greetee: ", props);
    return <span>{props.name}</span>;
}
