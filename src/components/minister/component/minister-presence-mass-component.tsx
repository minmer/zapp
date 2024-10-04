import { useEffect, useState } from "react";
import { Role } from "../../../structs/role";
import { User } from "../../../structs/user";
import { BooleanOutput, DateOutput, FetchInformationGetAll } from "../../../features/FetchInformationGet";
import { FetchInformationPost } from "../../../features/FetchInformationPost";
import { FetchInformationDelete } from "../../../features/FetchInformationDelete";
import { AliasExt } from "../minister-presence-subpage";


export default function MinisterPresenceMassComponent({ getParams, aliases, mass, role, presence }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>; type: string; show: boolean; }) => Promise<unknown>, aliases: AliasExt[], mass: DateOutput, role: Role | null, presence: boolean }) {
    const [presents, setPresents] = useState<AliasExt[]>([]);
    const [reporteds, setReporteds] = useState<AliasExt[]>([]);
    const [others, setOthers] = useState<AliasExt[]>([]);

    useEffect(() => {
        (async function () {
            setOthers(aliases.filter(alias => presents.find(present => present.alias.id == alias.alias.id) == null && reporteds.find(report => report.alias.id == alias.alias.id) == null));
        }());
    }, [getParams, aliases, presents, reporteds]);

    useEffect(() => {
        (async function () {

            await getParams({
                func: async (token: User | string) => {
                    const presences = await Promise.all(aliases.map(async (alias) => ({
                        alias: alias.alias.id,
                        declaration: (await FetchInformationGetAll('bool', token as string, mass.id + alias.alias.id) as BooleanOutput[]).length > 0,
                        report: (await FetchInformationGetAll('bool', token as string, mass.id + alias.alias.id + 'report') as BooleanOutput[]).length > 0 || alias.weeks.find(i => i == mass.output.getDay() * 24 + mass.output.getHours()),
                    })))
                    setPresents(aliases.filter((alias) => presences.find(present => present.alias == alias.alias.id && present.declaration)));
                    setReporteds(aliases.filter((alias) => presences.find(present => present.alias == alias.alias.id && present.report && !present.declaration)));
                    console.log(aliases)
                }, type: 'token', show: false
            });
        }());
    }, [getParams, aliases, mass]);

    const addDeclaration = async (alias: AliasExt, mass: DateOutput) => {
        await getParams({
            func: async (token: User | string) => {
                await FetchInformationPost(token as string, 'minister_presence', [mass.id + alias.alias.id], true, [1]);
                setPresents([...presents, alias]);
                setReporteds(reporteds.filter(a => a.alias.id != alias.alias.id));
                setOthers(others.filter(a => a.alias.id != alias.alias.id));
            }, type: 'token', show: false
        });
    };

    const removeDeclaration = async (alias: AliasExt, mass: DateOutput) => {
        await getParams({
            func: async (token: User | string) => {
                const declaration = await FetchInformationGetAll('bool', token as string, mass.id + alias.alias.id) as BooleanOutput[];
                for (let i = 0; i < declaration.length; i++)
                    FetchInformationDelete(token as string, 'minister_presence', declaration[i].id)
                setReporteds([...reporteds, alias]);
                setPresents(presents.filter(a => a.alias.id != alias.alias.id));
            }, type: 'token', show: false
        });
    };

    const addReport = async (alias: AliasExt, mass: DateOutput) => {
        await getParams({
            func: async (token: User | string) => {
                await FetchInformationPost(token as string, role?.roleID + 'groupchannel', [mass.id + alias.alias.id + 'report'], true, [1]);
                setReporteds([...reporteds, alias]);
                setOthers(others.filter(a => a.alias.id != alias.alias.id));
            }, type: 'token', show: false
        });
    };

    const removeReport = async (alias: AliasExt, mass: DateOutput) => {
        await getParams({
            func: async (token: User | string) => {
                const declaration = await FetchInformationGetAll('bool', token as string, mass.id + alias.alias.id + 'report') as BooleanOutput[];
                for (let i = 0; i < declaration.length; i++)
                    FetchInformationDelete(token as string, role?.roleID+'groupchannel', declaration[i].id)
                setOthers([...others, alias]);
                setReporteds(reporteds.filter(a => a.alias.id != alias.alias.id));
            }, type: 'token', show: false
        });
    };

    return (
        <div>
            <div>
                <>
                    <h5>Ministranci obecni na Mszy</h5>
                    {presents.map(present => (
                        (presence && Math.abs(mass.output.getTime() - Date.now()) < 5400000) || (presence && role != null) ? <span key={present.alias.id}><input type='button' value={present.alias.alias} onClick={() => removeDeclaration(present, mass)} /></span>
                            : <span key={present.alias.id}>{present.alias.alias}</span>
                    ))}
                    <h5>Ministranci zgłoszeni, że mają być</h5>
                    {reporteds.map(reported => (
                        (presence && Math.abs(mass.output.getTime() - Date.now()) < 5400000) || (presence && role != null) ?
                            <span key={reported.alias.id}><input type='button' value={reported.alias.alias} onClick={() => addDeclaration(reported, mass)} /></span> :
                            role?.roleID == reported?.alias.id ?
                                <span key={reported.alias.id}><input type='button' value={reported.alias.alias} onClick={() => removeReport(reported, mass)} /></span> :
                                <span key={reported.alias.id}>{reported.alias.alias}</span>
                    ))}
                    <h5>Pozostali ministranci</h5>
                    {others.map(other => (
                        (presence && Math.abs(mass.output.getTime() - Date.now()) < 5400000) || (presence && role != null) ?
                            <span key={other.alias.id}><input type='button' value={other.alias.alias} onClick={() => addDeclaration(other, mass)} /></span> :
                            role?.roleID == other.alias.id ?
                                <span key={other.alias.id}><input type='button' value={other.alias.alias} onClick={() => addReport(other, mass)} /></span> :
                            null
                    ))}
                </>
            </div>
        </div>
    );
}
