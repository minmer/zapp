import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import TripEnlistElement from "./trip-enlist-component";

interface IList {
    name: string,
    id: string
}

export default function TripsEnlistElement() {
    const { token } = useParams();
    const [lists, setLists] = useState<IList[]>([])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    const tempLists = []
                    const data = await FetchGetAll('text', token, 'trip_enlist') as StringOutput[]
                    for (let i = 0; i < data.length; i++) {
                        tempLists.push({
                            id: data[i].id,
                            name: data[i].output,
                        })
                        setLists(tempLists);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    return (
        <>
            {lists.map((list) => (
                <div>
                    <Link to={list.id}>
                        {list.name}
                    </Link>
                </div>
            ))
            }
            <Routes>
                <Route path="/:list" element={<TripEnlistElement />} />
            </Routes >
        </>
    );
}