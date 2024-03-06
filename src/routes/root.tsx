import { Outlet, Link } from "react-router-dom";
export default function Root() {



    const handleClick = async () => {
        try {
            console.log("Hello 1");
            const res = await fetch('https://zapp.hostingasp.pl/token/',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "databasekey": "c5jY&V8;kXo!5HFy?)Z8g%qzgC",
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            console.log("Hello 2");
        console.log(res);
    } catch (err) {
        console.log("Hello 4");
        console.log(err);
    }
    };

    return (
        <>
            <div id="sidebar">
                <h1>Recreatio - zaplecze techniczne</h1>
                <nav>
                    <ul>
                        <li>
                            <h2>
                                Intencje mszalne
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`/intenction`}>Intencje mszalne</Link>
                                </li>
                                <li>
                                    <Link to={`/obits`}>Intencje pogrzebowe</Link>
                                </li>
                            </ul>
                            <h2>
                                Sprawozdania finansowe
                            </h2>
                            <ul>
                                <li>
                                    <Link to={`/finance/finanseministrantow`}>Środki LSO</Link>
                                </li>
                                <li>
                                    <Link to={`/finance/dofinansowanie`}>Dofinansowanie do wyjazdów</Link>
                                </li>
                                <li>
                                    <Link to={`/finance/zakopane`}>Ferie Zakopane (21-23.02.2024 r.)</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>

            <form onSubmit={handleClick}>
                <button type="submit">New</button>
            </form>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}