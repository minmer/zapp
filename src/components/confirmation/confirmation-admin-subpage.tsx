import { useEffect, useState } from "react";
import { GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import { FetchTokenGet } from "../../features/FetchTokenGet";
import EditableElement from "../../generals/editable-element";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

export default function ConfirmationAdminSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {

    const [role, setRole] = useState<Role | null>()
    const [attendees, setAttendees] = useState<StringOutput[]>()
    useEffect(() => {
        (async function () {
            getParams({
                func: async (param0: unknown) => {
                    const token = param0 as string
                    setAttendees((await FetchInformationGetAll('string', token, 'confirmation_attendee')) as unknown as StringOutput[])
                    getParams({
                        func: async (param1: unknown) => {
                            const user = param1 as User
                            setRole(await GetRole({ getParams: getParams, type: 'confirmation_admin', user: user }))
                        }, type: 'user', show: false
                    });
                }, type: 'token', show: false
            });
        }());
    }, [getParams])

    const reload = async () => {
        getParams({
            func: async (param: unknown) => {
                    FetchTokenGet(param as string)
            }, type: 'token', show: false
        });
    }

    const removeAttendee = async (output: StringOutput) =>
    {
        getParams({
            func: async (param: unknown) => {
                const token = param as string
                FetchInformationDelete(token, output.id, output.output)
            }, type: 'token', show: false
        });
    }

    return (
        <>
            {role?.id + ' -|- ' + role?.role + ' -|- ' + role?.type + ' -|- ' + role?.user}
            <input type="button" value="Reload" onClick={reload} />
            {attendees?.map(attendee => (
                <div>
                    <EditableElement getParams={getParams} name={attendee.output  + "name"} dbkey={''} type="text" multiple={false} showdescription={false} />
                    <EditableElement getParams={getParams} name={attendee.output + "surname"} dbkey={''} type="text" multiple={false} showdescription={false} />
                    <input type='button' value='X' onClick={() => removeAttendee(attendee)} />
                </div>
            ))}
        </>
    );
}