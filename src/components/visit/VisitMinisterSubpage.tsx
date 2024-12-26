import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { FetchInformationGetAll } from "../../features/FetchInformationGet";
import { StringOutput, DateOutput, NumberOutput } from "../../features/NewFetchInformationGet";
import { FetchInformationPost } from "../../features/FetchInformationPost";

interface Route {
    id: string;
    output: string;
    startDateTime: Date;
    endDateTime: Date;
    ministers: ({ id: string, display: string, server: string } | null)[];
    addresses: { id: string, output: string, order: number, orderid: string }[];
}

export default function VisitMinisterSubpage() {
    const { minister, code } = useParams();
    const [isChecked, setIsChecked] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

    const ministers = [
        { id: '0', display: 'Dawid Polak' },
        { id: '1', display: 'Jakub Ludwikowski' },
        { id: '2', display: 'Marcin Nogieć' },
        { id: '3', display: 'Szymon Wdowiarz' },
        { id: '4', display: 'Filip Ślęczka' },
        { id: '5', display: 'Szymon Niemiec' },
        { id: '6', display: 'Piotr Nalepa' },
        { id: '7', display: 'Dawid Klak' },
        { id: '8', display: 'Bartosz Saramak' },
        { id: '9', display: 'Marcel Nowak' },
        { id: '10', display: 'Adam Jackowski' },
        { id: '11', display: 'Karol Rydzewski' },
        { id: '12', display: 'Franciszek Pietrzyk' },
        { id: '13', display: 'Jakub Sztuka' },
        { id: '14', display: 'Patryk Janik' },
        { id: '15', display: 'Kamil Kuśmierczyk' },
        { id: '16', display: 'Piotr Saramak' },
        { id: '17', display: 'Michał Nowak' },
        { id: '18', display: 'Mateusz Wons' },
        { id: '19', display: 'Michał Celej' },
        { id: '20', display: 'Jan Niemiec' },
        { id: '21', display: 'Michał Prokop' },
        { id: '22', display: 'Marek Gruszka' },
        { id: '23', display: 'Jan Kościelniak' },
        { id: '24', display: 'Jan Zawistowski' },
        { id: '25', display: 'Franciszek Klak' },
        { id: '26', display: 'Julian Konik-Korn' },
        { id: '27', display: 'Szymon Wons' },
        { id: '28', display: 'Kacper Wójcicki' },
    ];

    useEffect(() => {
        async function checkMinister() {
            const data = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "minister_visit_24_" + minister) as NumberOutput[];
            if (data.length > 0) {
                setIsChecked(code == data[0].output.toString());
            }
        }
        checkMinister();
    }, [minister, code]);

    useEffect(() => {
        async function fetchRoutesFromServer() {
            try {
                const fetchedRoutes = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_routes") as StringOutput[];

                const routesWithMinisters = await Promise.all(fetchedRoutes.map(async item => {
                    const startDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "start") as DateOutput[])[0]?.output;
                    const endDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "end") as DateOutput[])[0]?.output;
                    const minister1 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "minister1") as StringOutput[]);
                    const minister2 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "minister2") as StringOutput[]);
                    const minister3 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "minister3") as StringOutput[]);
                    const minister4 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "minister4") as StringOutput[]);

                    return {
                        id: item.id,
                        output: item.output,
                        startDateTime,
                        endDateTime,
                        ministers: [
                            minister1[0] ? { ...ministers.find(item => item.id == minister1[0].output), server: minister1[0].id } : null,
                            minister2[0] ? { ...ministers.find(item => item.id == minister2[0].output), server: minister2[0].id } : null,
                            minister3[0] ? { ...ministers.find(item => item.id == minister3[0].output), server: minister3[0].id } : null,
                            minister4[0] ? { ...ministers.find(item => item.id == minister4[0].output), server: minister4[0].id } : null
                        ],
                        addresses: []
                    };
                }));
                routesWithMinisters.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
                setRoutes(routesWithMinisters);
            } catch (error) {
                console.error("Failed to fetch routes from server:", error);
            }
        }

        fetchRoutesFromServer();
    }, []);

    const handleExpandRoute = async (routeId: string) => {
        const route = routes.find(route => route.id === routeId);
        if (route && route.addresses.length === 0) {
            try {
                const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeId + 'addresses') as StringOutput[];
                const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                    const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + routeId + "order") as NumberOutput[];
                    if (order.length == 0) {
                        const id = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [address.id + routeId + "order"], 0, [1]);
                        return { ...address, order: order[0]?.output || -1, orderid: id as string };
                    }
                    return { ...address, order: order[0]?.output || -1, orderid: order[0]?.id };
                }));
                orderedAddresses.sort((a, b) => a.order - b.order);
                route.addresses = orderedAddresses;
                setRoutes([...routes]);
            } catch (error) {
                console.error("Failed to fetch addresses from server:", error);
            }
        }
        setExpandedRoute(expandedRoute === routeId ? null : routeId);
    };

    const formatDate = (inputDate: Date) => {
        return new Intl.DateTimeFormat('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(inputDate);
    };

    const formatTime = (inputDate: Date) => {
        return new Intl.DateTimeFormat('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(inputDate);
    };

    const splitTimeRange = (start: Date, end: Date) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const midTime = new Date((startTime + endTime) / 2);
        return [new Date(startTime), midTime, new Date(endTime)];
    };

    return (
        <div className='visit_minister'>
            {isChecked ? (
                <div>
                    {routes.map(route => {
                        const isLinked = route.ministers.some(min => min?.id === minister);
                        const [start, mid, end] = splitTimeRange(route.startDateTime, route.endDateTime);
                        return (
                            <div key={route.id} className={`expandable-container ${isLinked ? '' : 'grayed-out'}`}>
                                <div className="expandable-item" onClick={() => handleExpandRoute(route.id)}>
                                    <h3>{route.output}</h3>
                                </div>
                                <div className="time-pairs">
                                    <div className="date">{formatDate(route.startDateTime)}</div>
                                    <div className="time-pair">
                                        <div className="ministers">
                                            {route.ministers[0] && <span>{route.ministers[0].display}</span>}
                                            {route.ministers[1] && <span>{route.ministers[1].display}</span>}
                                        </div>
                                        <span className="time-range"><b>{formatTime(route.startDateTime)} - {route.ministers[2] && route.ministers[3] ? formatTime(mid) : formatTime(route.endDateTime)}</b></span>
                                    </div>
                                    {route.ministers[2] && route.ministers[3] && (
                                        <div className="time-pair">
                                            <div className="ministers">
                                                {route.ministers[2] && <span>{route.ministers[2].display}</span>}
                                                {route.ministers[3] && <span>{route.ministers[3].display}</span>}
                                            </div>
                                            <span className="time-range"><b>{formatTime(mid)} - {formatTime(route.endDateTime)}</b></span>
                                        </div>
                                    )}
                                </div>
                                {expandedRoute === route.id && isLinked && (
                                    <div className="addresses">
                                        {route.addresses.map(address => (
                                            <div key={address.id}>
                                                <p>{address.output}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <h2>Link jest nieprawidłowy</h2>
            )}
        </div>
    );
}
