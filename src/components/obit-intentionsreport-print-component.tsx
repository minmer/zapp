import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BooleanOutput, FetchInformationGetAll, NumberOutput, StringOutput } from "../features/FetchInformationGet";
import logo from '../assets/logo.png'
import LoadingComponent from "../generals/LoadingComponent";

interface IIntention {
    id: string,
    name: string,
    mass?: Date
    isCollective: boolean
    donation: number
}
export default function ObitIntentionsReportPrint() {
    const { obit } = useParams();
    const token = "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U"
    const [intentions, setIntentions] = useState<IIntention[]>([])
    const [name, setName] = useState('')
    const [gridRow, setGridRow] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            try {

                if (token !== undefined) {
                    setName((await FetchInformationGetAll('string', token, 'obit') as StringOutput[]).filter(p => p.id == obit)[0].output)
                    const tempData = (await FetchInformationGetAll('string', token, obit + 'intention') as StringOutput[]).map(p => ({ id: p.id, name: p.output, mass: undefined as unknown as Date, isCollective: false, donation: -1 }))
                    for (let i = 0; i < tempData.length; i++) {
                        const data = (await FetchInformationGetAll('double', token, tempData[i].id + 'mass') as NumberOutput[])[0]
                        tempData[i].donation = (await FetchInformationGetAll('double', token, tempData[i].id + 'donation') as NumberOutput[])[0]?.output ?? -1
                        if (data) {
                            tempData[i].mass = new Date(data?.output)
                            tempData[i].isCollective = (await FetchInformationGetAll('bool', token, data.id + 'collective') as BooleanOutput[])[0]?.output ?? false
                        }
                    }
                    tempData.sort((a, b) => a.mass ? (b.mass ? (a.isCollective ? (b.isCollective ? (a.mass.getTime() - b.mass.getTime()) : 1) : (b.isCollective ? -1 : (a.mass.getTime() - b.mass.getTime()))) : -1) : (b.mass ? 1 : 0))
                    let tempGridRow = '1px';
                    for (let i = 0; i < tempData.length; i++) {
                        tempGridRow += ' Auto 1px'
                    }
                    console.log(tempData)
                    setIntentions(tempData)
                    setGridRow(tempGridRow)
                    setIsLoading(false)
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token, obit])

    return (
        <div className="print-obit">
            <div className="title">{"śp. " + name}</div>
            <div className="intentions"
                style={{
                    gridTemplateRows: gridRow
                }}>
                <div className="horizontal" style={{
                    gridRow: 1,
                }} />
                <div className="horizontal" style={{
                    display: intentions.some(a => a.isCollective) ? 'block' : 'none',
                    gridRow: intentions.filter(a => a.mass && !a.isCollective).length * 2 + 1,
                }} />
                <div className="horizontal" style={{
                    display: intentions.some(a => a.mass) ? 'block' : 'none',
                    gridRow: intentions.filter(a => a.mass).length * 2 + 1,
                }} />
                <div className="horizontal" style={{
                    gridRow: intentions.length * 2 + 1,
                }} />
                <div className="vertical" style={{
                    gridColumn: 1,
                }} />
                <div className="vertical" style={{
                    gridColumn: 3,
                }} />
                <div className="vertical" style={{
                    gridColumn: 7,
                }} />
                <div className="vertical" style={{
                    gridColumn: 9,
                }} />
                <div className="intention-description" style={{
                    display: intentions.some(a => a.mass && !a.isCollective) ? 'block' : 'none',
                    gridRow: '2/span ' + (intentions.filter(a => a.mass && !a.isCollective).length * 2 - 1),
                }}>Msze Św. parafialne indywidualne</div>
                <div className="intention-description" style={{
                    display: intentions.some(a => a.isCollective) ? 'block' : 'none',
                    gridRow: (intentions.filter(a => a.mass && !a.isCollective).length * 2 + 2) + '/span ' + (intentions.filter(a => a.mass && a.isCollective).length * 2 - 1),
                }}>Msze Św. parafialne zbiorowe</div>
                <div className="intention-description" style={{
                    display: intentions.some(a => !a.mass) ? 'block' : 'none',
                    gridRow: intentions.filter(a => a.mass).length * 2 + 2 + '/span ' + (intentions.length * 2 - intentions.filter(a => a.mass).length * 2 - 1),
                }}>Msze Św. bezterminowe (w parafii lub poza)</div>
                {intentions.map((intention, i) => (
                    <>
                        <div className="mass" style={{
                            display: intention.mass ? 'block' : 'none',
                            gridRow: i * 2 + 2,
                        }}>{
                                (intention.mass?.getDate() + '.').padStart(3, '0') + (((intention.mass?.getMonth() ?? 0 + 1) + 1) + '.').padStart(3, '0') + intention.mass?.getFullYear() + ' - ' + intention.mass?.getHours() + ':' + intention.mass?.getMinutes().toString().padStart(2, '0')}
                        </div>
                        <div className="intention" style={{
                            gridRow: i * 2 + 2,
                        }} >{intention.name.substring(name.length + 3)}
                        </div>
                        <div className="donation" style={{
                            gridRow: i * 2 + 2,
                        }} >{intention.donation}
                        </div>
                    </>
                ))}
        </div>
            <div className="loadingcontainer" style=
                {{
                    display: isLoading ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
                <LoadingComponent />
            </div>
        </div>
    );
}