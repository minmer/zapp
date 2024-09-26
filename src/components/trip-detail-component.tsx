import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FetchInformationGetAll, NumberOutput, StringOutput } from "../features/FetchInformationGet";
import { FetchInformationPost } from "../features/FetchInformationPost";
import { FetchInformationDelete } from "../features/FetchInformationDelete";
import OldEditableElement from "../temp/old-editable-element";
import LoadingComponent from "../generals/loading-component";
import { User } from "../structs/user";

interface IValue {
    name: string,
    description: string,
    type: string,
    direction: number,
    id: string,
}

interface IRole {
    name: string,
    role: string,
    id: string,
}

export default function TripsCreateElement({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { token, list, role } = useParams();
    const [newValue, setValue] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("")
    const [direction, setDirection] = useState(0)
    const [values, setValues] = useState<IValue[]>([])
    const [isAdmin, setIsAdmin] = useState(false);
    const [roles, setRoles] = useState<IRole[]>([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    setIsLoading(true);
                    setIsAdmin(((await FetchInformationGetAll('text', token, 'admin') as []).length == 0 ? false : true));
                    const tempValues = []
                    const data = await FetchInformationGetAll('text', token, list + 'values') as StringOutput[]
                    for (let i = 0; i < data.length; i++) {
                        tempValues.push({
                            id: data[i].id,
                            name: data[i].output,
                            description: (await FetchInformationGetAll('text', token, data[i].id + 'description') as StringOutput[])[0]?.output,
                            type: (await FetchInformationGetAll('text', token, data[i].id + 'type') as StringOutput[])[0]?.output,
                            direction: (await FetchInformationGetAll('integer', token, data[i].id + 'direction') as NumberOutput[])[0]?.output
                        })
                    }
                    setValues(tempValues);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, list])

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setIsLoading(true);
                    const rolesData = (await FetchInformationGetAll('text', token, 'role_' + list) as StringOutput[]);
                    const tempRoles = [];
                    for (let i = 0; i < rolesData.length; i++) {
                        tempRoles.push({ name: (await FetchInformationGetAll('text', token, rolesData[i].output + 'name') as StringOutput[])[0]?.output, id: rolesData[i].id, role: rolesData[i].output});
                    }
                    setRoles(tempRoles);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, list]);

    const removeValue = async (id: string) => {
        FetchInformationDelete(token ?? '', 'main_token', id)
    }

    const addValue = async () => {
        const attributeID = await FetchInformationPost(token ?? '', 'rolegroup_trip_' + list + '_admin', [list + 'values'], newValue, [values.length])
        await FetchInformationPost(token ?? '', 'rolegroup_trip_' + list + '_admin', [attributeID + 'description'], description, [values.length])
        await FetchInformationPost(token ?? '', 'rolegroup_trip_' + list + '_admin', [attributeID + 'type'], type, [values.length])
        await FetchInformationPost(token ?? '', 'rolegroup_trip_' + list + '_admin', [attributeID + 'direction'], direction, [values.length])
        setValues(values => [...values, {
            id: attributeID,
            name: newValue,
            description: description,
            type: type,
            direction: direction}]);
    }

    return (
        <>
            <div>
                <div style={{
                    display: isAdmin ? 'block' : 'none',
                }} >
                    {values.map((value) => (
                        <div>
                            <div>
                                {value.name + ' - ' + value.description + ' - ' + value.direction + ' - ' + value.type}
                            </div>
                            <input type="button" onClick={() => { removeValue(value.id) }} value='X' />
                        </div>
                    ))}
                    <input type="string"
                        placeholder="Value"
                        onChange={(e) => {
                            setValue(e.target.value)
                        }}
                        value={newValue} />
                    <input type="string"
                        placeholder="Description"
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                        value={description} />
                    <input type="string"
                        placeholder="Direction"
                        onChange={(e) => {
                            setDirection(Number(e.target.value))
                        }}
                        value={direction} />
                    <input type="string"
                        placeholder="Type"
                        onChange={(e) => {
                            setType(e.target.value)
                        }}
                        value={type} />
                    <input type="button" onClick={addValue} value="+" />
                </div>
                <div style={{
                    display: role ? 'none' : 'block',
                }} >
                    {roles.map((role) => (
                        <>
                            <Link to={role.role}>
                                {role.name}
                            </Link>
                            -
                        </>
                    ))}
                </div>
                <div className="input123" style={{
                    display: role ? 'block' : 'none',
                }} >
                    {values.map((value) => (
                        <>
                            <div style={{
                                display: isAdmin == (value.direction == 1) ? 'block' : 'none',
                            }} >
                                <OldEditableElement getParams={getParams} showdescription={true} description={value.description} type={value.type} name={role + value.name} multiple={false} dbkey={"role_trip_" + role} />
                            </div>
                            <div style={{
                                display: isAdmin !== (value.direction == 1) ? 'block' : 'none',
                            }} >
                                <OldEditableElement getParams={getParams} showdescription={true} description={value.description} type={value.type} name={role + value.name} multiple={false} dbkey={'rolegroup_trip_' + list + '_admin'} />
                            </div>
                        </>
                    ))}
                </div>
                <div className="loadingcontainer" style=
                    {{
                        display: isLoading ? 'block' : 'none',
                    }}>
                    <LoadingComponent />
                </div>
            </div>
        </>
    );
}