import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import ObitEditElement from "./obit-edit-component";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { User } from "../structs/user";

interface IObit {
    id: string,
    name: string
}

export default function ObitsEditElement({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [obits, setObits] = useState<IObit[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        (async function () {
            try {
                getParams({
                    func: async (param: string | User) => {
                        const token = param as string
                        setIsAdmin(((await FetchInformationGetAll('string', token, 'admin') as []).length == 0 ? false : true))
                        const fetchedObits = (await FetchInformationGetAll('string', token, 'obit') as StringOutput[])
                        setObits(fetchedObits.map(p => ({ id: p.id, name: p.output })).sort((a, b) => a.name.localeCompare(b.name)))
                    }, type: 'token', show: false
                });
            } catch (e) {
                console.error(e);
            }
        })();
    }, [getParams])


    const removeObit = async (obit: IObit) => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                FetchInformationDelete(token ?? '', 'new_intention_admin', obit.id)
            }, type: 'token', show: false
        });
    }

    const createObit = async () => {
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                await FetchInformationPost(token ?? '', 'new_intention_admin', ['obit'], name, [obits.length])
            }, type: 'token', show: false
        });
    }

    return (
        <>
            <div className="obits-list-containera">
                <div className="obits-lista">
                    <input type="string"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        value={name} />
                    <input type="button" onClick={createObit} value="Otwórz zapisy" />
                    <div className="obits-list-container">
                        <div className="obits-list">
                            {obits.map((obit) => (
                                <div className="obit-list" key={obit.id}>
                                    <Link to={obit.id}>
                                        {obit.name}
                                    </Link>
                                    <input style={{
                                        display: isAdmin ? 'block' : 'none',
                                    }}
                                        type="button" onClick={() => { removeObit(obit) }} value='X' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Routes>
                <Route path="/:obit" element={<ObitEditElement getParams={getParams} />} />
            </Routes>
        </>
    );
}
