import { useEffect, useState } from "react";
import { User } from "../../structs/user";
import { DateOutput, FetchInformationGet, FetchInformationGetAll } from "../../features/FetchInformationGet";
import { useParams } from "react-router-dom";
import { CompareDate } from "../helpers/DateComparer";

export default function PrintIntentionreportSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const { start, end } = useParams()
    const [masses, setMasses] = useState<
        {
            date: Date,
            collective: boolean,
            intentions: {
                intention: string,
                donation: number,
                donated: string,
                celebrator: string,
            }[],
        }[]>([])

    useEffect(() => {
        if (start == undefined || end == undefined)
            return
        const priests = ['ks. Michał', 'ks. Proboszcz', 'ks. Leszek', 'ks. Gość 1', 'ks. Gość 2', 'ks. Gość 3', 'unknown']
        getParams({
            func: async (param: string | User) => {
                const token = param as string
                const tempMasses = await Promise.all((await FetchInformationGet('datetime', token, 'new_zielonki_mass', Number(start), Number(end), 'new_intention_viewer')).map(async (mass) => (
                    {
                    date: (mass as DateOutput).output,
                    collective: (await FetchInformationGetAll('bool', token, mass.id + 'collective'))[0]?.output as boolean,
                        intentions: await Promise.all((await FetchInformationGetAll('string', token, mass.id + 'intention')).map(async (intention) => (
                        {
                                intention: intention.output as string,
                                donation: (await FetchInformationGetAll('double', token, intention.id + 'donation'))[0]?.output as number,
                            donated: priests[Number((await FetchInformationGetAll('string', token, intention.id + 'donated'))[0]?.output as string) ?? 6],
                            celebrator: priests[Number((await FetchInformationGetAll('string', token, intention.id + 'celebrator'))[0]?.output as string) ?? 6],
                        })))
                })))
                setMasses(tempMasses)
            }, type: 'token', show: true
        });
    }, [getParams, start, end])

    return (

        <div className='intentionreport'>
            <div className='intentionreportgrid'>
                <h2>Data</h2>
                <h2>Celebrans</h2>
                <h2>Intencja</h2>
                <h2>ks. Proboszcz</h2>
                <h2>ks. Leszek</h2>
                <h2>ks. Michał</h2>
                {masses.map(mass =>
                    <>
                        <div style={{
                            gridRow: 'auto / ' + mass.intentions.length + ' span',
                        }}>
                            {mass.date.getDate().toString().padStart(2, '0') + '.' +
                                (mass.date.getMonth() + 1).toString().padStart(2, '0') + '.' +
                                mass.date.getFullYear() + ' r. - ' +
                                mass.date.getHours() + ':' +
                                mass.date.getMinutes().toString().padStart(2, '0')}
                        </div>
                        {mass.intentions.map((intention, index) =>
                            <>
                                {!mass.collective || index == 0 ? <div style={{
                                    gridRow: mass.collective && index == 0 ? 'auto / ' + mass.intentions.length + ' span' : 'auto',
                                }}>
                                    {intention.celebrator}
                                </div> : null}
                                <div style={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {intention.intention}
                                </div>
                                <div>
                                    {intention.donated == 'ks. Proboszcz' ? intention.donation.toString() : ''}
                                </div>
                                <div>
                                    {intention.donated == 'ks. Leszek' ? intention.donation.toString() : ''}
                                </div>
                                <div>
                                    {intention.donated == 'ks. Michał' ? intention.donation.toString() : ''}
                                </div>
                            </>
                        )}
                    </>
                )}
                <h2>Intencje</h2>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Ilość intencji: ' + masses.reduce((partialSum, mass) => partialSum + mass.intentions.length, 0) + '\n' + 'Zbiorowe intencji: ' + masses.reduce((partialSum, mass) => partialSum + (mass.collective ? mass.intentions.length : 0), 0) + '\n' + 'Odprawione Msze: ' + masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 1 : mass.intentions.length), 0)}
                </div>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Suma intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + intention.donation, 0), 0) + 'zł' + '\n' + 'Suma zbior. int: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? intention.donation : 0), 0), 0) + 'zł' + '\n' + 'Średnia intencji: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) + 1 / 900).toString().padEnd(5, '0').slice(0, 5) + 'zł'}
                </div>
                <div style={{
                    gridColumn: 'auto / 3 span',
                    whiteSpace: 'break-spaces',
                }}>
                    {'Wypłacono: ' + (masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 1 : mass.intentions.length), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) + 1 / 900).toString().padEnd(5, '0').slice(0, 7) + ' zł\nZostało: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? intention.donation : 0), 0), 0) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) * masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 1 : 0), 0) + 1 / 900).toString().padEnd(5, '0').slice(0, 7) + ' zł'}
                </div>
                <h2>ks. Proboszcz</h2>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Odprawione Msze: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) + '\nIntencje bez ofiary: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' ? ((!mass.collective || index == 1) && intention.donation == 0 ? 1 : 0) : 0), 0), 0) + '\n' + 'Intencje binowane: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Proboszcz' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0)}
                </div>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Ilość intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Proboszcz' ? 1 : 0), 0), 0) + '\n' + 'Suma intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Proboszcz' ? intention.donation : 0), 0), 0) + 'zł\nNienależne (zbiorowe): ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + (mass.collective ? mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' ? intention.donation : 0), 0) : 0), 0) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) * masses.reduce((partialSum, mass) => partialSum + (mass.collective && mass.intentions.filter(intention => intention.celebrator == 'ks. Proboszcz').length > 0 ? 1 : 0), 0)).toString().slice(0, 6) + 'zł'}
                </div>
                <div style={{
                    gridColumn: 'auto / 3 span',
                    whiteSpace: 'break-spaces',
                }}>
                    {'Intencje należne: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nW tym binowane: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Proboszcz' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nDo przekazania: ' + (Math.floor(((masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Proboszcz' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Proboszcz' ? intention.donation : 0), 0), 0)) / 10 + .9999) * 10) + ' zł'}
                </div>
                <h2>ks. Leszek</h2>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Odprawione Msze: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Leszek' ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) + '\nIntencje bez ofiary: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Leszek' ? ((!mass.collective || index == 1) && intention.donation == 0 ? 1 : 0) : 0), 0), 0) + '\n' + 'Intencje binowane: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Leszek' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Leszek' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0)}
                </div>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Ilość intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Leszek' ? 1 : 0), 0), 0) + '\n' + 'Suma intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Leszek' ? intention.donation : 0), 0), 0) + 'zł\nNienależne (zbiorowe): ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + (mass.collective ? mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Leszek' ? intention.donation : 0), 0) : 0), 0) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) * masses.reduce((partialSum, mass) => partialSum + (mass.collective && mass.intentions.filter(intention => intention.celebrator == 'ks. Leszek').length > 0 ? 1 : 0), 0)).toString().slice(0, 6) + 'zł'}
                </div>
                <div style={{
                    gridColumn: 'auto / 3 span',
                    whiteSpace: 'break-spaces',
                }}>
                    {'Intencje należne: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Leszek' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nW tym binowane: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Leszek' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Leszek' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nDo przekazania: ' + (Math.floor(((masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Leszek' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Leszek' ? intention.donation : 0), 0), 0)) / 10 + .9999) * 10) + ' zł'}
                </div>
                <h2>ks. Michał</h2>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Odprawione Msze: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Michał' ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) + '\nIntencje bez ofiary: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Michał' ? ((!mass.collective || index == 1) && intention.donation == 0 ? 1 : 0) : 0), 0), 0) + '\n' + 'Intencje binowane: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Michał' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Michał' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0)}
                </div>
                <div style={{
                    whiteSpace: 'break-spaces',
                }}>
                    {'Ilość intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Michał' ? 1 : 0), 0), 0) + '\n' + 'Suma intencji: ' + masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Michał' ? intention.donation : 0), 0), 0) + 'zł\nNienależne (zbiorowe): ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + (mass.collective ? mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Michał' ? intention.donation : 0), 0) : 0), 0) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0) * masses.reduce((partialSum, mass) => partialSum + (mass.collective && mass.intentions.filter(intention => intention.celebrator == 'ks. Michał').length > 0 ? 1 : 0), 0)).toString().slice(0, 6) + 'zł'}
                </div>
                <div style={{
                    gridColumn: 'auto / 3 span',
                    whiteSpace: 'break-spaces',
                }}>
                    {'Intencje należne: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Michał' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nW tym binowane: ' + (masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.celebrator == 'ks. Michał' && intention.donation != 0 ? masses.filter(bin => CompareDate(bin.date, mass.date) && bin.date.getTime() < mass.date.getTime() && (bin.intentions.reduce((partialSum_2, bin_int) => partialSum_2 + (bin_int.celebrator == 'ks. Michał' ? bin_int.donation != 0 ? 1 : 0 : 0), 0) > 0)).length > 0 ? 1 : 0 : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)).toString().slice(0, 6) + ' zł\nDo przekazania: ' + (Math.floor(((masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention, index) => partialSum_1 + (intention.celebrator == 'ks. Michał' && intention.donation != 0 ? (!mass.collective || index == 1 ? 1 : 0) : 0), 0), 0) * masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (mass.collective ? 0 : intention.donation), 0), 0) / masses.reduce((partialSum, mass) => partialSum + (mass.collective ? 0 : mass.intentions.filter(intention => intention.donation != 0).length), 0)) - masses.reduce((partialSum_0, mass) => partialSum_0 + mass.intentions.reduce((partialSum_1, intention) => partialSum_1 + (intention.donated == 'ks. Michał' ? intention.donation : 0), 0), 0)) / 10 + .9999) * 10) + ' zł'}
                </div>
            </div>
        </div>
    );
}