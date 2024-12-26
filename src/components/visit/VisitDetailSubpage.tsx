import { useState, useEffect } from "react";
import { FetchInformationGetAll, StringOutput, DateOutput, NumberOutput } from "../../features/FetchInformationGet";

interface VisitData {
    address: string;
    lastName: string;
    husbandName: string;
    husbandBirthDate: string;
    husbandBirthPlace: string;
    wifeName: string;
    wifeBirthDate: string;
    wifeBirthPlace: string;
    marriageDate: string;
    marriageType: string;
    marriageParish: string;
    children: string;
    otherFamilyMembers: string;
    additionalInfo: string;
    visit2011: string;
    visit2012: string;
    visit2013: string;
    visit2014: string;
    visit2015: string;
    visit2016: string;
    visit2017: string;
    visit2018: string;
    visit2019: string;
    visit2020: string;
    visit2021: string;
    visit2022: string;
    visit2023: string;
    visit2024: string;
}

interface Route {
    id: string;
    output: string;
    startDateTime: Date;
    endDateTime: Date;
}

export default function VisitDetailSubpage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [routeAddresses, setRouteAddresses] = useState<{ id: string, output: string, order: number, orderid: string }[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [visitData, setVisitData] = useState<VisitData | null>(null);

    const fetchRoutesFromServer = async () => {
        try {
            const fetchedRoutes = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_routes") as StringOutput[];
            const routesWithDetails = await Promise.all(fetchedRoutes.map(async item => {
                const startDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "start") as DateOutput[])[0]?.output;
                const endDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + "end") as DateOutput[])[0]?.output;
                return {
                    id: item.id,
                    output: item.output,
                    startDateTime,
                    endDateTime
                };
            }));
            setRoutes(routesWithDetails);
        } catch (error) {
            console.error("Failed to fetch routes from server:", error);
        }
    };

    const fetchRouteAddresses = async (routeId: string) => {
        try {
            const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeId + 'addresses') as StringOutput[];
            const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + routeId + "order") as NumberOutput[];
                return { ...address, order: order[0]?.output || -1, orderid: order[0]?.id };
            }));
            orderedAddresses.sort((a, b) => a.order - b.order);
            setRouteAddresses(orderedAddresses);
        } catch (error) {
            console.error("Failed to fetch route addresses:", error);
        }
    };

    const fetchVisitData = async (addressId: string) => {
        try {
            const visitData: VisitData = {
                address: addressId,
                lastName: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'lastName') as StringOutput[])[0]?.output || "/brak/",
                husbandName: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'husbandName') as StringOutput[])[0]?.output || "/brak/",
                husbandBirthDate: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'husbandBirthDate') as StringOutput[])[0]?.output || "/brak/",
                husbandBirthPlace: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'husbandBirthPlace') as StringOutput[])[0]?.output || "/brak/",
                wifeName: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'wifeName') as StringOutput[])[0]?.output || "/brak/",
                wifeBirthDate: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'wifeBirthDate') as StringOutput[])[0]?.output || "/brak/",
                wifeBirthPlace: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'wifeBirthPlace') as StringOutput[])[0]?.output || "/brak/",
                marriageDate: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'marriageDate') as StringOutput[])[0]?.output || "/brak/",
                marriageType: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'marriageType') as StringOutput[])[0]?.output || "/brak/",
                marriageParish: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'marriageParish') as StringOutput[])[0]?.output || "/brak/",
                children: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'children') as StringOutput[])[0]?.output || "/brak/",
                otherFamilyMembers: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'otherFamilyMembers') as StringOutput[])[0]?.output || "/brak/",
                additionalInfo: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'additionalInfo') as StringOutput[])[0]?.output || "/brak/",
                visit2011: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2011') as StringOutput[])[0]?.output || "X",
                visit2012: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2012') as StringOutput[])[0]?.output || "X",
                visit2013: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2013') as StringOutput[])[0]?.output || "X",
                visit2014: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2014') as StringOutput[])[0]?.output || "X",
                visit2015: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2015') as StringOutput[])[0]?.output || "X",
                visit2016: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2016') as StringOutput[])[0]?.output || "X",
                visit2017: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2017') as StringOutput[])[0]?.output || "X",
                visit2018: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2018') as StringOutput[])[0]?.output || "X",
                visit2019: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2019') as StringOutput[])[0]?.output || "X",
                visit2020: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2020') as StringOutput[])[0]?.output || "X",
                visit2021: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2021') as StringOutput[])[0]?.output || "X",
                visit2022: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2022') as StringOutput[])[0]?.output || "X",
                visit2023: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2023') as StringOutput[])[0]?.output || "X",
                visit2024: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + 'visit2024') as StringOutput[])[0]?.output || "X",
            };
            setVisitData(visitData);
        } catch (error) {
            console.error("Failed to fetch visit data:", error);
        }
    };

    useEffect(() => {
        fetchRoutesFromServer();
    }, []);

    useEffect(() => {
        if (selectedRoute) {
            fetchRouteAddresses(selectedRoute.id);
        }
    }, [selectedRoute]);

    useEffect(() => {
        if (selectedAddress) {
            fetchVisitData(selectedAddress);
        }
    }, [selectedAddress]);

    const handlePreviousAddress = () => {
        if (selectedAddress) {
            const currentIndex = routeAddresses.findIndex(address => address.id === selectedAddress);
            if (currentIndex > 0) {
                setSelectedAddress(routeAddresses[currentIndex - 1].id);
            }
        }
    };

    const handleNextAddress = () => {
        if (selectedAddress) {
            const currentIndex = routeAddresses.findIndex(address => address.id === selectedAddress);
            if (currentIndex < routeAddresses.length - 1) {
                setSelectedAddress(routeAddresses[currentIndex + 1].id);
            }
        }
    };


    return (
        <div className='visit_detail'>
            <div className="route-selection">
                <label htmlFor="route-select">Select a route:</label>
                <select id="route-select" className='select-route' value={selectedRoute?.id || ""} onChange={(e) => setSelectedRoute(routes.find(item => item.id === e.target.value) || null)}>
                    <option value="">Select a route</option>
                    {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {`${route.output} (${new Date(route.startDateTime).toLocaleString()} - ${new Date(route.endDateTime).toLocaleString()})`}
                        </option>
                    ))}
                </select>
            </div>
            {selectedRoute && (
                <div className="route-details">
                    <label htmlFor="address-select">Select an address:</label>
                    <select id="address-select" className="address-select" value={selectedAddress || ""} onChange={(e) => setSelectedAddress(e.target.value)}>
                        <option value="">Select an address</option>
                        {routeAddresses.map((address) => (
                            <option key={address.id} value={address.id}>
                                {address.output}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {visitData && (
                <div className="visit-data">
                    <h3>Visit Data</h3>
                    <div className="visit-data-grid">
                        <div className="address-info">
                            <p>{visitData.address} - {visitData.lastName}</p>
                        </div>
                        <div className="husband-info">
                            <p>{visitData.husbandName}</p>
                            <p>{visitData.husbandBirthDate}</p>
                            <p>{visitData.husbandBirthPlace}</p>
                        </div>
                        <div className="wife-info">
                            <p>{visitData.wifeName}</p>
                            <p>{visitData.wifeBirthDate}</p>
                            <p>{visitData.wifeBirthPlace}</p>
                        </div>
                        <div className="marriage-info">
                            <p>{visitData.marriageDate}</p>
                            <p>{visitData.marriageType}</p>
                            <p>{visitData.marriageParish}</p>
                        </div>
                        <div className="children-info">
                            <p>{visitData.children}</p>
                            <p>{visitData.otherFamilyMembers}</p>
                            <p>{visitData.additionalInfo}</p>
                        </div>
                        <div className="visit-history">
                            <p>{`${visitData.visit2011}${visitData.visit2012}${visitData.visit2013}${visitData.visit2014}${visitData.visit2015}${visitData.visit2016}${visitData.visit2017}${visitData.visit2018}${visitData.visit2019}${visitData.visit2020}${visitData.visit2021}${visitData.visit2022}${visitData.visit2023}${visitData.visit2024}`}</p>
                        </div>
                    </div>
                    <div className="navigation-buttons">
                        <button onClick={handlePreviousAddress}>Previous</button>
                        <button onClick={handleNextAddress}>Next</button>
                    </div>
                </div>
            )}
        </div>

    );
}
