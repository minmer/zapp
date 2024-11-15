import { useParams } from "react-router-dom";
import { FetchInformationGetAll, StringOutput } from "../features/FetchInformationGet";
import { useEffect, useState } from "react";
import LoadingComponent from "../generals/LoadingComponent";
import { FetchOwnerPost } from "../features/FetchOwnerPost";
import { FetchShareOwner } from "../features/FetchShareOwner";
export default function UserPermissionElement({ permission }: { permission: string })  {
    const { token } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)
    const [viewer, setViewer] = useState<string | undefined>(undefined)
    const [admin, setAdmin] = useState<string | undefined>(undefined)
    const [donated, setDonated] = useState<string | undefined>(undefined)

    useEffect(() => {
        (async function () {
            try {
                if (token !== undefined) {
                    const adminData = await FetchInformationGetAll('text', token, 'key_' + permission + '_admin') as unknown as StringOutput[]
                    setAdmin(adminData[0]?.output)
                    const viewerData = await FetchInformationGetAll('text', token, 'key_' + permission + '_viewer') as unknown as StringOutput[]
                    setViewer(viewerData[0]?.output)
                }
            } catch (e) {
                console.error(e);
            }
            setIsLoaded(true)
        })();
    }, [token, permission])

    const createPermission = async () => {
        await FetchOwnerPost(token ?? '', permission + '_admin', 'main_token')
        const tokenData = await FetchInformationGetAll('text', token ?? '', 'key_main_token') as unknown as StringOutput[]
        await FetchShareOwner(token ?? '', permission + '_viewer', permission + '_admin', tokenData[0]?.output ?? '', false, true)
    }

    const sharePermission = async (donator: string) => {
        await FetchShareOwner(token ?? '', permission + donator, permission + donator, donated ?? '', true, true)
    }

    return (
        <>
            <div>
                <div>
                    <h5>{permission}</h5>
                    <div style=
                        {{
                            display: admin ? 'none' : 'block',
                        }}>
                        <input type="button" onClick={createPermission} value="Create permission" />
                    </div>
                    <div style=
                        {{
                        display: admin ? 'block' : 'none',
                        }}>
                        <input type="string"
                            onChange={(e) => {
                                setDonated(e.target.value)
                            }}
                            value={donated } />
                        <p>Admin: {admin} <input type="button" onClick={() => { sharePermission('_admin') }} value="Share" /></p>
                        <p>Viewer: {viewer} <input type="button" onClick={() => { sharePermission('_viewer') }} value="Share" /></p>
                    </div>
                </div>
                <div className="loadingcontainer" style=
                    {{
                        display: isLoaded ? 'none' : 'block',
                    }}>
                    <LoadingComponent />
                </div>
            </div>
        </>
    );
}