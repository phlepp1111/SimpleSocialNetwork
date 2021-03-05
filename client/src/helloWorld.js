import Greetee from "./greetee";
import Counter from "./counter";
export default function HelloWorld() {
    const firstname = "Philipp";
    return (
        <div>
            <div className="spiced">
                Hello, <Greetee name={firstname} />! {20 * 40}
            </div>
            <div>
                Hello, <Greetee name="Fennel" />! {20 * 40}
            </div>
            <div>
                Hello <Greetee />
            </div>
            <Counter />
        </div>
    );
}
