import { useState, useEffect } from "react";
import { FetchInformationGetAll, StringOutput, DateOutput, NumberOutput } from "../../features/FetchInformationGet";

interface Route {
    id: string;
    output: string;
    startDateTime: Date;
    endDateTime: Date;
    addresses: { id: string, output: string, order: number, visit2022: string, visit2023: string, visit2024: string, probability: number, visitTime: Date | null, timeRange?: [Date, Date] }[];
}

export default function VisitCheckSubpage() {
    const [addresses, setAddresses] = useState<StringOutput[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredAddresses, setFilteredAddresses] = useState<StringOutput[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<StringOutput | null>(null);
    const [routeID, setRouteID] = useState<StringOutput | null>(null);
    const [route, setRoute] = useState<Route | null>(null);

    const fetchAddresses = async () => {
        try {
            const fetchedData = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_adresses_03") as StringOutput[];
            setAddresses(fetchedData);
        } catch (error) {
            console.error("Nie udało się pobrać adresów z serwera:", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (searchQuery.length > 5) {
            const filtered = addresses.filter((address) =>
                address.output.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAddresses(filtered);
        } else {
            setFilteredAddresses([]);
        }
    }, [searchQuery, addresses]);

    useEffect(() => {
        const fetchRouteID = async () => {
            if (selectedAddress) {
                try {
                    const routeData = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", selectedAddress.id + 'route') as StringOutput[];
                    if (routeData.length > 0) {
                        setRouteID(routeData[0]);
                    } else {
                        setRouteID(null);
                    }
                } catch (error) {
                    console.error("Nie udało się pobrać ID trasy z serwera:", error);
                }
            }
        };
        fetchRouteID();
    }, [selectedAddress]);

    useEffect(() => {
        const fetchRouteDetails = async () => {
            if (routeID) {
                try {
                    const startDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + "start") as DateOutput[])[0]?.output;
                    const endDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + "end") as DateOutput[])[0]?.output;
                    const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + 'addresses') as StringOutput[];
                    const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                        const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + routeID.id + "order") as NumberOutput[];
                        const visit2022 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2022") as StringOutput[])[0]?.output || "N";
                        const visit2023 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2023") as StringOutput[])[0]?.output || "N";
                        const visit2024 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2024") as StringOutput[])[0]?.output || "N";
                        const visitTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit_time") as DateOutput[])[0]?.output || null;
                        const probability = calculateProbability(visit2022, visit2023, visit2024);
                        return { id: address.id, output: address.output, order: order[0]?.output || -1, visit2022, visit2023, visit2024, probability, visitTime };
                    }));
                    orderedAddresses.sort((a, b) => a.order - b.order);
                    const routeDetails: Route = {
                        id: routeID.id,
                        output: routeID.output,
                        startDateTime: new Date(startDateTime),
                        endDateTime: new Date(endDateTime),
                        addresses: orderedAddresses
                    };
                    setRoute(routeDetails);
                    calculateSupposedVisitTimeRanges(routeDetails);
                } catch (error) {
                    console.error("Nie udało się pobrać szczegółów trasy z serwera:", error);
                }
            }
        };
        fetchRouteDetails();
    }, [routeID]);

    const calculateProbability = (visit2022: string, visit2023: string, visit2024: string): number => {
        let probability = 0;
        if (visit2024 === "T") probability += 65;
        if (visit2023 === "T") probability += 25;
        if (visit2022 === "T") probability += 10;
        return probability;
    };

    const calculateSupposedVisitTimeRanges = (route: Route) => {
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

        setRoute({ ...route, addresses });
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

    return (
        <div className="visit-check">
            <label htmlFor="address-search">Szukaj adresu:</label>
            <input
                id="address-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wprowadź adres"
                className="input-field"
            />
            {filteredAddresses.length > 0 && (
                <div>
                    <label htmlFor="address-select">Wybierz adres:</label>
                    <select
                        id="address-select"
                        value={selectedAddress ? selectedAddress.output : ""}
                        onChange={(e) => {
                            const address = addresses.find(addr => addr.output === e.target.value);
                            setSelectedAddress(address || null);
                        }}
                        className="input-field"
                    >
                        <option value="">--Proszę wybrać adres--</option>
                        {filteredAddresses.slice(0, 10).map((address) => (
                            <option key={address.id} value={address.output}>
                                {address.output}
                            </option>
                        ))}
                    </select>
                    {filteredAddresses.length > 10 && (
                        <p>Proszę zawęzić wyszukiwanie, aby zobaczyć bardziej szczegółowe wyniki.</p>
                    )}
                </div>
            )}
            {selectedAddress && (
                <div>
                    <h3>Wybrany adres:</h3>
                    <p>{selectedAddress.output}</p>
                    {route && (
                        <div>
                            <h4>Trasa:</h4>
                            <p>{route.output}</p>
                            <h4>Data trasy:</h4>
                            <p>{formatDate(route.startDateTime)}</p>
                            <h4>Oczekiwany zakres czasu wizyty:</h4>
                            {route.addresses.map(address => (
                                address.output === selectedAddress.output && address.timeRange && (
                                    <p key={address.id}>
                                        {formatTime(address.timeRange[0])} - {formatTime(address.timeRange[1])}
                                    </p>
                                )
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
