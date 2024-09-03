import { useEffect, useState } from "react";
import { GetRole, Role } from "../../structs/role";
import { User } from "../../structs/user";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import EditableElement from "../../generals/editable-element";
import { FetchInformationPost } from "../../features/FetchInformationPost";

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
                            const owner = await FetchInformationGetAll('string', token, tempRole.roleID + 'owner') as unknown as StringOutput[]
                            if (owner.length == 0 || owner == null) {
                                await FetchInformationPost(token, tempRole.roleID, [tempRole.roleID + 'owner'], tempRole.ownerID, [1])
                            }
                            const levels = await FetchInformationGetAll('string', token, tempRole.roleID + 'level') as unknown as StringOutput[]
                            for (let i = 0; i < levels.length; i++) {
                                if (levels[i].output == '1')
                                    setLevel0(true)
                                if (levels[i].output == '2')
                                    setLevel1(true)
                                if (levels[i].output == '3')
                                    setLevel2(true)
                            }
                        }, type: 'user', show: true
                    });
                }, type: 'token', show: true
            });
        }());
    }, [getParams])

    return (
        <>
            {
                !(level0 || level1 || level2 || !level2) ? <>
                    <h3>Zgłoszenie czeka na zatwierdzenie</h3>
                </> :
                    <>
                        {
                            level0 ? <>
                                <h2>1. rok formacji</h2>
                            </> : null
                        }
                        {
                            level1 ? <>
                                <h2>2. rok formacji</h2>
                            </> : null
                        }
                        {
                            level2 || !level2 ? <>
                                <h2>3. rok formacji</h2>
                                {level2 ? <>
                                    <div>Prosze o zapoznanie się poniższymi informacjami:</div>
                                    <EditableElement getParams={getParams} name={role?.roleID + 'baptism'} dbkey={role?.roleID + 'channel'} description='Chrzest' type="text" multiple={false} showdescription={true} />
                                    <EditableElement getParams={getParams} name={role?.roleID + 'permission'} dbkey={role?.roleID + 'channel'} description='Zgoda' type="text" multiple={false} showdescription={true} />
                                </> : null}
                                <div>Prosze o uzupełnienie poniższych informacji:</div>
                                <div>
                                    <EditableElement getParams={getParams} name={role?.roleID + 'birthday'} dbkey={role?.roleID ?? ''} description='Data urodzenia' type="text" multiple={false} showdescription={true} />
                                </div>
                                <div>
                                <EditableElement getParams={getParams} name={role?.roleID + 'address'} dbkey={role?.roleID ?? ''} description='Adres zamieszkania' type="text" multiple={false} showdescription={true} />
                                </div>
                                <div>
                                <EditableElement getParams={getParams} name={role?.roleID + 'confirmationname'} dbkey={role?.roleID ?? ''} description='Patron bierzmowanie (tzw. 3. imię)' type="text" multiple={false} showdescription={true} />
                                </div>
                                <div>
                                <EditableElement getParams={getParams} name={role?.roleID + 'sponsor'} dbkey={role?.roleID ?? ''} description='Świadek bierzmowania' type="text" multiple={false} showdescription={true} />
                                </div>
                            </> : null
                        }

                    </>
            }
        </>
    );
}