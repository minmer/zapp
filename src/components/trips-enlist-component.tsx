import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import TripEnlistElement from "./trip-enlist-component";
import TripDetailElement from "./trip-detail-component";
import { User } from "../structs/user";

interface IList {
    name: string,
    id: string
}

export default function TripsEnlistElement({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { token } = useParams();
    const [lists, setLists] = useState<IList[]>([])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    const tempLists = []
                    const data = await FetchInformationGetAll('string', token, 'trip_enlist') as StringOutput[]
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
                <Route path="/:list/:role" element={<TripDetailElement getParams={getParams} />} />
            </Routes >
        </>
    );
}