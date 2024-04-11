import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchGetAll, StringOutput } from "../features/FetchGet";
import CommunionDetailComponent from "./communion-detail-component";

interface IChild {
    id: string,
    name: string
}

export default function CommunionsDetailElement() {
    const { token } = useParams();
    const [children, setChildren] = useState<IChild[]>([])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    const tempChildren = []
                    const data = (await FetchGetAll('text', token, 'communion_child') as StringOutput[]).map(p => p.output)
                    for (let i = 0; i < data.length; i++) {
                        tempChildren.push({
                            id: data[i], name: (await FetchGetAll('text', token, data[i] + 'name') as StringOutput[])[0].output
                    })
                    }
                    setChildren(tempChildren)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    return (
        <>
            {children.map((child) => (
                <div>
                    <Link to={child.id}>
                        {child.name}
                    </Link>
                </div>
            ))
            }
            <Routes>
                <Route path="/:role" element={<CommunionDetailComponent />} />
            </Routes >
        </>
    );
}