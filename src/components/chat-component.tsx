import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import CommunionDetailComponent from "./communion-detail-component";
import { FetchInformationDelete } from "../features/FetchInformationDelete";

interface IChild {
    link: string,
    id: string,
    name: string
}

export default function ChatElement({ name }: { name: string }) {
    const { token } = useParams();
    const [children, setChildren] = useState<IChild[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    console.log(name)
    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsAdmin(((await FetchInformationGetAll('text', token, 'admin') as []).length == 0 ? false : true))
                    const tempChildren = []
                    const data = (await FetchInformationGetAll('text', token, 'communion_child') as StringOutput[])
                    for (let i = 0; i < data.length; i++) {
                        tempChildren.push({
                            link: data[i].id, id: data[i].output, name: (await FetchInformationGetAll('text', token, data[i].output + 'name') as StringOutput[])[0].output
                    })
                    }
                    setChildren(tempChildren)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token])

    const removeCommunion = async (child: IChild) => {
        FetchInformationDelete(token ?? '', 'adminrole_' + child.id, child.link)
    }

    return (
        <>
            {children.map((child) => (
                <div className="inline-communion-list">
                    <Link to={child.id}>
                        {child.name}
                    </Link>
                    <input style=
                        {{
                            display: isAdmin ? 'none' : 'none',
                        }}
                        type="button" onClick={() => { removeCommunion(child) }} value='X' />
                </div>
            ))
            }
            <div className="clear" />
            <Routes>
                <Route path="/:role" element={<CommunionDetailComponent />} />
            </Routes >
        </>
    );
}