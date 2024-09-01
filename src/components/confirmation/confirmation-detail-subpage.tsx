import { useEffect, useState } from "react";
import { GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import EditableElement from "../../generals/editable-element";

export default function ConfirmationDetailSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [role, setRole] = useState<Role | undefined>()
    const [level0, setLevel0] = useState(false)
    const [level1, setLevel1] = useState(false)
    const [level2, setLevel2] = useState(false)

    useEffect(() => {
        (async function () {
            getParams({
                func: async (param0: unknown) => {
                    getParams({
                        func: async (param1: unknown) => {
                            const token = param0 as string
                            const user = param1 as User
                            const tempRole = await GetRole({ getParams: getParams, type: "confirmation", user: user }) as unknown as Role
                            setRole(tempRole)
                            const levels = FetchInformationGetAll('string', token, tempRole.id + 'level') as unknown as StringOutput[]
                            for (let i = 0; i < levels.length; i++) {
                                if (levels[i].output == '1')
                                    setLevel0(true)
                                if (levels[i].output == '2')
                                    setLevel1(true)
                                if (levels[i].output == '3')
                                    setLevel2(true)
                            }
                        }, type: 'user', show: false
                    });
                }, type: 'token', show: false
            });
        }());
    }, [getParams])

    return (
        <>
            {
                level0 ?? <>
                    <h2>1. rok formacji</h2>
                </>
            }
            {
                level1 ?? <>
                    <h2>2. rok formacji</h2>
                </>
            }
            {
                level2 ?? <>
                    <h2>3. rok formacji</h2>
                    <EditableElement getParams={getParams} name={role?.id + 'baptism'} dbkey={''} description='Chrzest' type="text" multiple={false} showdescription={true} />
                    <EditableElement getParams={getParams} name={role?.id + 'permission'} dbkey={''} description='Zgoda' type="text" multiple={false} showdescription={true} />
                </>
            }
        </>
    );
}