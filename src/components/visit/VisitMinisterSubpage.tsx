import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { FetchInformationGetAll } from "../../features/FetchInformationGet";
import { StringOutput, DateOutput, NumberOutput } from "../../features/NewFetchInformationGet";
import { FetchInformationPost } from "../../features/FetchInformationPost";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

interface Route {
    id: string;
    output: string;
    startDateTime: Date;
    endDateTime: Date;
    ministers: ({ id: string, display: string, server: string } | null)[];
    addresses: { id: string, output: string, order: number, orderid: string, visit2022: string, visit2023: string, visit2024: string, probability: number, probabilityDescription: string, additionalInfo: { option: string[], from: string[], to: string[], notes: string[], contact: string[], reg: Date[] }, visitInfo: string | null, visitTime: Date | null, timeRange?: [Date, Date]}[];
}

export default function VisitMinisterSubpage() {
    const { minister, code } = useParams();
    const [isChecked, setIsChecked] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
    const [expandedAddress, setExpandedAddress] = useState<string | null>(null);
    const [moneyAmounts, setMoneyAmounts] = useState<{ [routeId: string]: { [ministerId: string]: number } }>({});
    const [winterTripChoice, setWinterTripChoice] = useState<string | null>(null);
    const [summerTripChoice, setSummerTripChoice] = useState<string | null>(null);
    const [givenAmounts, setGivenAmounts] = useState<{ [ministerId: string]: number }>({});

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
        async function fetchChoices() {
            const winterChoice = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "winter_trip_choice_" + minister) as StringOutput[];
            const summerChoice = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "summer_trip_choice_" + minister) as StringOutput[];
            if (winterChoice.length > 0) {
                setWinterTripChoice(winterChoice[0].output);
            }
            if (summerChoice.length > 0) {
                setSummerTripChoice(summerChoice[0].output);
            }
        }

        fetchChoices();
    }, [minister]);

    const handleWinterTripChoice = async (choice: string) => {
        setWinterTripChoice(choice);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["winter_trip_choice_" + minister], choice, [1]);
    };

    const handleSummerTripChoice = async (choice: string) => {
        setSummerTripChoice(choice);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["summer_trip_choice_" + minister], choice, [1]);
    };

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

                    const moneyAmounts = await Promise.all([
                        await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + minister1[0]?.output + "money") as NumberOutput[],
                        await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + minister2[0]?.output + "money") as NumberOutput[],
                        await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + minister3[0]?.output + "money") as NumberOutput[],
                        await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", item.id + minister4[0]?.output + "money") as NumberOutput[]
                    ]);

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
                        addresses: [],
                        moneyAmounts: {
                            [minister1[0]?.output]: moneyAmounts[0][0]?.output || 0,
                            [minister2[0]?.output]: moneyAmounts[1][0]?.output || 0,
                            [minister3[0]?.output]: moneyAmounts[2][0]?.output || 0,
                            [minister4[0]?.output]: moneyAmounts[3][0]?.output || 0
                        }
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


    useEffect(() => {
        async function fetchMoneyAmounts() {
            const moneyAmounts = {};
            for (const route of routes) {
                for (const minister of route.ministers) {
                    if (minister) {
                        const amount = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", route.id + minister.id + "money") as NumberOutput[];
                        if (amount.length > 0) {
                            if (!moneyAmounts[route.id]) {
                                moneyAmounts[route.id] = {};
                            }
                            moneyAmounts[route.id][minister.id] = amount[0].output;


                            const givenAmountsEntries = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", minister.id + "money") as NumberOutput[];
                            const totalGiven = givenAmountsEntries.reduce((sum, amount) => sum + amount.output, 0);
                            givenAmounts[minister.id] = totalGiven;
                        }
                    }
                }
            }
            setMoneyAmounts(moneyAmounts);
        }

        if (routes.length > 0) {
            fetchMoneyAmounts();
        }
    }, [routes]);

    const calculateTotalGiven = () => {
        return givenAmounts[minister] || 0;
    };


    // Add this function to calculate the total amount of money collected by the logged-in minister
    const calculateTotalMoney = () => {
        return Object.values(moneyAmounts).reduce((total, route) => {
            return total + (route[minister] || 0);
        }, 0);
    };

    const handleExpandRoute = async (routeId: string) => {
        const route = routes.find(route => route.id === routeId);
        if (route && route.addresses.length === 0 && route.ministers.some(item => item.id == minister)) {
            try {
                const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeId + 'addresses') as StringOutput[];
                const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                    const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + routeId + "order") as NumberOutput[];
                    const visit2022 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2022") as StringOutput[])[0]?.output || "X";
                    const visit2023 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2023") as StringOutput[])[0]?.output || "X";
                    const visit2024 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2024") as StringOutput[])[0]?.output || "X";
                    const visitOption = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visitOption") as StringOutput[];
                    const visitInfo = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit_info") as StringOutput[])[0]?.output || null;
                    const visitTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit_time") as DateOutput[])[0]?.output || null;
                    let additionalInfo = { option: visitOption.map(info => info.output), from: [], to: [], notes: [], contact: [], reg: [] };
                    let probabilityDescription = null;
                    if (visitOption.length > 0) {
                        const [from, to, notes, contact, reg] = await Promise.all([
                            FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visitTimeFrom") as Promise<StringOutput[]>,
                            FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visitTimeTo") as Promise<StringOutput[]>,
                            FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "additionalNotes") as Promise<StringOutput[]>,
                            FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "contactInfo") as Promise<StringOutput[]>,
                            FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "registrationDate") as Promise<DateOutput[]>
                        ]);
                        additionalInfo = {
                            option: visitOption.map(info => info.output),
                            from: from.map(info => info.output),
                            to: to.map(info => info.output),
                            notes: notes.map(info => info.output),
                            contact: contact.map(info => info.output),
                            reg: reg.map(info => new Date(info.output))
                        };
                    }

                    let probability = calculateProbability(visit2022, visit2023, visit2024);
                    if (visitOption.find(item => item.output == "Zapraszamy na kolędę w wyznaczonym terminie")) {
                        probability = 100;
                        probabilityDescription = 'Zapraszają';
                    } else if (visitOption.find(item => item.output == "Prosimy o kolędę w innym dniu")) {
                        probability = 0;
                        probabilityDescription = 'Prosili o kolędę w innym dniu';
                    }

                    if (order.length == 0) {
                        const id = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [address.id + routeId + "order"], 0, [1]);
                        return { ...address, probabilityDescription: probabilityDescription ?? (probability > 95 ? 'Na pewno przyjmują' : probability > 80 ? 'Raczej przyjmują' : probability > 25 ? 'Warto próbować' : probability > 5 ? 'Jeden raz zadzwonić' : 'Nie przyjmują'), order: order[0]?.output || -1, orderid: id as string, visit2022, visit2023, visit2024, probability, additionalInfo: additionalInfo, visitInfo, visitTime };
                    }
                    return { ...address, probabilityDescription: probabilityDescription ?? (probability > 95 ? 'Na pewno przyjmują' : probability > 80 ? 'Raczej przyjmują' : probability > 25 ? 'Warto próbować' : probability > 5 ? 'Jeden raz zadzwonić' : 'Nie przyjmują'), order: order[0]?.output || -1, orderid: order[0]?.id, visit2022, visit2023, visit2024, probability, additionalInfo: additionalInfo, visitInfo, visitTime };
                }));
                orderedAddresses.sort((a, b) => a.order - b.order);
                route.addresses = orderedAddresses;
                calculateSupposedVisitTimeRanges(routes); // Recalculate visit times after loading the route
                setRoutes([...routes]);
                console.log(routes)
            } catch (error) {
                console.error("Failed to fetch addresses from server:", error);
            }
        }
        setExpandedRoute(expandedRoute === routeId ? null : routeId);
    };

    const handleExpandAddress = (addressId: string) => {
        setExpandedAddress(expandedAddress === addressId ? null : addressId);
    };

    const handlePostVisitInfo = async (addressId: string, info: string) => {
        const visitTime = new Date();
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit_info"], info, [1]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit_time"], visitTime, [1]);
        setRoutes(routes.map(route => {
            const updatedRoute = {
                ...route,
                addresses: route.addresses.map(address => address.id === addressId ? { ...address, visitInfo: info, visitTime } : address)
            };
            calculateSupposedVisitTimeRanges([updatedRoute]); // Recalculate visit times after posting visit information
            return updatedRoute;
        }));
    };


    const handleDeleteVisitInfo = async (addressId: string) => {
        const visitInfoID = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + "visit_info") as StringOutput[])[0]?.id;
        const visitTimeID = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", addressId + "visit_time") as DateOutput[])[0]?.id;
        await FetchInformationDelete("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", visitInfoID );
        await FetchInformationDelete("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", visitTimeID );
        setRoutes(routes.map(route => ({
            ...route,
            addresses: route.addresses.map(address => address.id === addressId ? { ...address, visitInfo: null, visitTime: null } : address)
        })));
    };

    const calculateProbability = (visit2022: string, visit2023: string, visit2024: string): number => {
        let probability = 0;
        if (visit2024 === "T") probability += 65;
        if (visit2023 === "T") probability += 25;
        if (visit2022 === "T") probability += 10;
        if (visit2024 === "X") probability += 30;
        if (visit2023 === "X") probability += 15;
        if (visit2022 === "X") probability += 5;
        return probability;
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
        return midTime;
    };

    const calculateSupposedVisitTimeRanges = (routes: Route[]) => {
        routes.forEach(route => {
            const totalRouteDuration = route.endDateTime.getTime() - route.startDateTime.getTime();
            const addresses = route.addresses;

            // Start with a supposed time of 10 minutes per visit
            let supposedAverageVisitTime = 10 * 60 * 1000; // 10 minutes in milliseconds

            // Calculate total probability sum (as a fraction)
            const totalProbabilitySum = addresses.reduce((sum, addr) => sum + addr.probability / 100, 0);

            // If possible, adjust supposedAverageVisitTime based on total probabilities and route duration
            if (totalProbabilitySum > 0) {
                supposedAverageVisitTime = totalRouteDuration / totalProbabilitySum;
            }

            // Check for actual visit times
            const actualVisitTimes = addresses
                .filter(addr => addr.visitTime)
                .map(addr => addr.visitTime!.getTime());

            if (actualVisitTimes.length > 0) {
                // Find the latest visit time
                const latestVisitTimeValue = Math.max(...actualVisitTimes);
                const remainingTime = route.endDateTime.getTime() - latestVisitTimeValue;

                // Get addresses after the latest visit
                const indexOfLatestVisit = addresses.findIndex(
                    addr => addr.visitTime && addr.visitTime.getTime() === latestVisitTimeValue
                );
                const remainingAddresses = addresses.slice(indexOfLatestVisit + 1);

                // Sum probabilities of remaining addresses
                const remainingProbabilitySum = remainingAddresses.reduce(
                    (sum, addr) => sum + addr.probability / 100,
                    0
                );

                // Adjust supposedAverageVisitTime based on the remaining time and probabilities
                if (remainingProbabilitySum > 0) {
                    supposedAverageVisitTime = remainingTime / remainingProbabilitySum;
                }
            }

            // Adjust supposedAverageVisitTime based on the latest visit durations (up to 5% impact)
            const visitDurations: number[] = [];
            for (let i = 1; i < addresses.length; i++) {
                if (addresses[i].visitTime && addresses[i - 1].visitTime) {
                    const duration =
                        addresses[i].visitTime!.getTime() - addresses[i - 1].visitTime!.getTime();
                    visitDurations.push(duration);
                }
            }
            const latestVisitDurations = visitDurations.slice(-10); // Up to 10 latest visits
            if (latestVisitDurations.length > 0) {
                const averageActualVisitDuration =
                    latestVisitDurations.reduce((sum, dur) => sum + dur, 0) /
                    latestVisitDurations.length;

                // Calculate adjustment (maximum 5% impact)
                const difference = averageActualVisitDuration - supposedAverageVisitTime;
                const adjustment = difference * 0.05 * latestVisitDurations.length; // 5% of the difference

                supposedAverageVisitTime += adjustment;
            }

            // Assign visit times and time ranges to addresses
            let currentTime: number;

            if (actualVisitTimes.length > 0) {
                currentTime = Math.max(...actualVisitTimes);
            } else {
                currentTime = route.startDateTime.getTime();
            }

            addresses.forEach(address => {
                if (address.visitTime) {
                    // Use actual visit time
                    address.timeRange = [address.visitTime, address.visitTime];
                    currentTime = address.visitTime.getTime();
                } else {
                    // Calculate adjusted duration based on probability
                    const adjustedDuration = supposedAverageVisitTime * (address.probability / 100);

                    const range = 10 * 60 * 1000 + 65 * 60 * 1000 * (Math.min(Math.max((currentTime - (route.startDateTime.getTime() > Date.now() ? route.startDateTime.getTime() : Date.now())) / (240 * 60 * 1000), 0), 1));

                    address.timeRange = [
                        new Date(currentTime - range),
                        new Date(currentTime + range)
                    ];

                    if (address.probability > 0) {
                        currentTime += adjustedDuration;
                    }
                }
            });
        });
    };


    const handleMoneyInputChange = (routeId: string, ministerId: string, amount: number) => {
        setMoneyAmounts(prev => ({
            ...prev,
            [routeId]: {
                ...prev[routeId],
                [ministerId]: amount
            }
        }));
    };


    const handleSaveMoneyAmount = async (routeId: string, ministerId: string) => {
        const amount = moneyAmounts[routeId]?.[ministerId];
        if (amount !== undefined) {
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [routeId + ministerId + "money"], amount, [1]);
        }
    };

    const calculateTotalToGive = () => {
        const totalMoney = calculateTotalMoney();
        let totalToGive = totalMoney * 0.2; // 20% for the common amount

        if (winterTripChoice === "Tak") {
            totalToGive += totalMoney * 0.2; // Additional 20% for the winter trip
        }

        if (summerTripChoice === "Tak") {
            totalToGive += totalMoney * 0.1; // Additional 10% for the summer trip
        }

        return totalToGive;
    };


    return (
        <div className='visit_minister'>
            {isChecked ? (
                <div>
                    {routes.map(route => {
                        const isLinked = route.ministers.some(min => min?.id === minister);
                        const mid = splitTimeRange(route.startDateTime, route.endDateTime);
                        return (
                            <div key={route.id} className={`expandable-container ${isLinked ? '' : 'grayed-out'}`}>
                                <div className="expandable-item" onClick={() => handleExpandRoute(route.id)}>
                                    <h3>{route.output}</h3>
                                    {isLinked && expandedRoute !== route.id && (
                                        <span className="time-range">
                                            <b>{formatDate(route.startDateTime)} {formatTime(route.startDateTime)} - {formatTime(route.endDateTime)}</b>
                                        </span>
                                    )}
                                </div>
                                {expandedRoute === route.id && isLinked && (
                                    <div>
                                        {route.ministers.map(min => min && min.id === minister && (
                                            <div key={min.id} className="money-input">
                                                <input
                                                    type="number"
                                                    value={moneyAmounts[route.id]?.[min.id] || ''}
                                                    onChange={(e) => handleMoneyInputChange(route.id, min.id, parseFloat(e.target.value))}
                                                    placeholder="Wpisz kwotę, którą Ty osobiście zebrałeś tego dnia"
                                                />
                                                <button onClick={() => handleSaveMoneyAmount(route.id, min.id)}>Zapisz</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {expandedRoute === route.id && (
                                    <div className="time-pairs">
                                        <div className="date">{formatDate(route.startDateTime)}</div>
                                        <div className="time-pair">
                                            <div className="ministers">
                                                {route.ministers[0] && <span>{route.ministers[0].display}</span>}
                                                {route.ministers[1] && <span>{route.ministers[1].display}</span>}
                                            </div>
                                            <span className="time-range">{route.ministers[0]?.id === minister || route.ministers[1]?.id === minister ? <b>{formatTime(route.startDateTime)} - {route.ministers[2] && route.ministers[3] ? formatTime(mid) : formatTime(route.endDateTime)}</b> : `${formatTime(route.startDateTime)} - ${route.ministers[2] && route.ministers[3] ? formatTime(mid) : formatTime(route.endDateTime)}`}</span>
                                        </div>
                                        {route.ministers[2] && route.ministers[3] && (
                                            <div className="time-pair">
                                                <div className="ministers">
                                                    {route.ministers[2] && <span>{route.ministers[2].display}</span>}
                                                    {route.ministers[3] && <span>{route.ministers[3].display}</span>}
                                                </div>
                                                <span className="time-range">{route.ministers[2]?.id === minister || route.ministers[3]?.id === minister ? <b>{formatTime(mid)} - {formatTime(route.endDateTime)}</b> : `${formatTime(mid)} - ${formatTime(route.endDateTime)}`}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {expandedRoute === route.id && isLinked && (
                                    <div className="addresses">
                                        {route.addresses.map(address => (
                                            <div key={address.id}>
                                                <p style={{ fontWeight: address.probability !== 0 ? 'bold' : 'normal' }}>
                                                    {address.output} - {address.probabilityDescription}
                                                    {address.timeRange && (
                                                        <span className="time-range">
                                                            {formatTime(address.timeRange[0])} - {formatTime(address.timeRange[1])}
                                                        </span>
                                                    )}
                                                    {address.additionalInfo.option.length > 0 && (
                                                        <span className="info-icon" onClick={() => handleExpandAddress(address.id)}> ℹ️ </span>
                                                    )}
                                                </p>
                                                {expandedAddress === address.id && (
                                                    <div className="additional-info">
                                                        <p><strong>Visit Option:</strong> {address.additionalInfo.option.join(", ")}</p>
                                                        {address.additionalInfo.from.length > 0 && <p><strong>Available From:</strong> {address.additionalInfo.from.join(", ")}</p>}
                                                        {address.additionalInfo.to.length > 0 && <p><strong>Available To:</strong> {address.additionalInfo.to.join(", ")}</p>}
                                                        {address.additionalInfo.notes.length > 0 && <p><strong>Additional Notes:</strong> {address.additionalInfo.notes.join(", ")}</p>}
                                                        {address.additionalInfo.contact.length > 0 && <p><strong>Contact Info:</strong> {address.additionalInfo.contact.join(", ")}</p>}
                                                        {address.additionalInfo.reg.length > 0 && <p><strong>Registration Date:</strong> {address.additionalInfo.reg.map(date => formatDate(date)).join(", ")}</p>}
                                                    </div>
                                                )}
                                                {address.visitInfo ? (
                                                    <button onClick={() => handleDeleteVisitInfo(address.id)} className="delete-button">Skasuj informację</button>
                                                ) : (
                                                    <div className="visit-info-buttons"
                                                        style={{ opacity: address.probability !== 0 ? '1' : '.2' }}>
                                                        <button onClick={() => handlePostVisitInfo(address.id, 'Przyjęli')} className="button">Przyjęli</button>
                                                        <button onClick={() => handlePostVisitInfo(address.id, 'Nie otworzyli')} className="button">Nie otworzyli</button>
                                                        <button onClick={() => handlePostVisitInfo(address.id, 'Odmówili przyjęcie')} className="button">Odmówili przyjęcie</button>
                                                        <button onClick={() => handlePostVisitInfo(address.id, 'Proszą o inny termin')} className="button">Proszą o inny termin</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div className="total-money">
                        <h3>Łączna kwota zebrana przez Ciebie: {calculateTotalMoney()} PLN</h3>
                        <p>Łączna kwota do przekazania: {calculateTotalToGive()} PLN</p>
                        <p>Łączna kwota już przekazana księdzu: {calculateTotalGiven()} PLN</p>
                        <p>Łączna kwota jeszcze do przekazania księdzu: {calculateTotalToGive() -calculateTotalGiven()} PLN</p>
                        <p>20% idzie do wspólnej kasy LSO (m.in. pizza, Michałki, dofinansowanie na wycieczki)</p>
                        <div className="trip-choice">
                            <p>Czy chcesz korzystać z dofinansowania na wyjazd feryjny (należy wtedy przekazać dodatkowe 20% do wspólnej kasy)?</p>
                            {winterTripChoice ? (
                                <p>Twój wybór: {winterTripChoice}</p>
                            ) : (
                                <div>
                                    <button onClick={() => handleWinterTripChoice("Tak")}>Tak</button>
                                    <button onClick={() => handleWinterTripChoice("Nie")}>Nie</button>
                                </div>
                            )}
                        </div>
                        <div className="trip-choice">
                            <p>Czy chcesz korzystać z dofinansowania na wyjazd wakacyjny (należy wtedy przekazać dodatkowe 10% do wspólnej kasy)?</p>
                            {summerTripChoice ? (
                                <p>Twój wybór: {summerTripChoice}</p>
                            ) : (
                                <div>
                                    <button onClick={() => handleSummerTripChoice("Tak")}>Tak</button>
                                    <button onClick={() => handleSummerTripChoice("Nie")}>Nie</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <h2>Link jest nieprawidłowy</h2>
            )}
        </div>
    );




}

