import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CommunionDetailElement() {
    const { token, role } = useParams();

    useEffect(() => {
        (async function () {
        })();
    }, [token, role])

    return (
        <>
            <div>Adres</div>
            <div>Data i miejsce urodzin</div>
            <div>Chrzest Święty</div>
            <div>Zaliczenia</div>
            <div>Telefon</div>
        </>
    );
}