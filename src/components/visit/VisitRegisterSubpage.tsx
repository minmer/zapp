import { useState, useEffect } from "react";
import { FetchInformationGetAll, StringOutput, DateOutput, NumberOutput } from "../../features/FetchInformationGet";
import { FetchInformationPost } from "../../features/FetchInformationPost";

interface Route {
    id: string;
    output: string;
    startDateTime: Date;
    endDateTime: Date;
    addresses: { id: string, output: string, order: number, visit2022: string, visit2023: string, visit2024: string, probability: number, visitTime: Date | null, timeRange?: [Date, Date] }[];
}

const villages = {
    "Zielonki": [
        "Amerykańska", "Babilon", "Bankowa", "Bzowa", "Do Cegielni", "Długopolska", "Fiołkowa", "Galicyjska", "Gliniki", "Grochowalskiego", "Gwizdałów", "Górzysta", "Kanadyjska", "Klubowa", "Krajobrazowa", "Krakowskie Przedmieście", "Ks. Adama Zięby", "Lawendowa", "Malownicza", "Modrzewiowa", "Na Brzegu", "Na Błonie", "Na Ogrody", "Na Piaski", "Na Podskalu", "Na Popielówkę", "Na Stoku", "Na Winnice", "Na Łąki", "Nad Naramką", "Nadrzeczna", "Noclegowa", "Osiedlowa", "Paryska", "Rzyczyska", "Różana", "Saneczkowa", "Skowronkowa", "Spacerowa", "Staropolska", "Sympatyczna", "Szlak Bursztynowy", "Słoneczna", "Tarasowa", "Trojanowicka", "Wiarusa", "Widokowa", "Wokalna", "Wrzosowa", "Wspólna", "Wyjazdowa", "Zacisze", "Zielone Jary", "Zielone Wzgórze", "Złota", "Złote Piaski", "Gwiezdna", "Ks. Jana Michalika", "Pękowicka", "Wiktorii Baranówny", "Wyborna", "Zjazdowa"
    ],
    "Garlica Murowana": [
        "Bazaltowa", "Dolomitowa", "Garlicka", "Granitowa", "Krzemowa", "Marmurowa", "Piaskowa", "Pograniczna"
    ],
    "Pękowice": [
        "Cesarska", "Dworska", "Galicyjska", "Jurajska", "Na Błonie", "Na Stoku", "Pod Fortem", "Wiśniowa", "Zakole"
    ]
};

export default function VisitRegisterSubpage() {
    const [addresses, setAddresses] = useState<StringOutput[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredAddresses, setFilteredAddresses] = useState<StringOutput[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<StringOutput | null>(null);
    const [selectedVillage, setSelectedVillage] = useState<string>("");
    const [selectedStreet, setSelectedStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [visitOption, setVisitOption] = useState<string>("");
    const [visitTimeFrom, setVisitTimeFrom] = useState<string>("");
    const [visitTimeTo, setVisitTimeTo] = useState<string>("");
    const [additionalNotes, setAdditionalNotes] = useState<string>("");
    const [contactInfo, setContactInfo] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
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
                        const routeID = routeData[0];
                        const startDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + "start") as DateOutput[])[0]?.output;
                        const endDateTime = (await FetchInformationGetAll("datetime", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + "end") as DateOutput[])[0]?.output;
                        const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", routeID.id + 'addresses') as StringOutput[];
                        const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                            const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + routeID.id + "order") as NumberOutput[];
                            const visit2022 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2022") as StringOutput[])[0]?.output || "X";
                            const visit2023 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2023") as StringOutput[])[0]?.output || "X";
                            const visit2024 = (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + "visit2024") as StringOutput[])[0]?.output || "X";
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
                    } else {
                        setRoute(null);
                    }
                } catch (error) {
                    console.error("Nie udało się pobrać ID trasy z serwera:", error);
                }
            }
        };
        fetchRouteID();
    }, [selectedAddress]);

    const handleAddAddress = async () => {
        const fullAddress = `${selectedVillage} ${selectedStreet} ${houseNumber}`;
        const preorder = generatePreorderValue(fullAddress);
        const addressId = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["visit_adresses_03"], fullAddress, [preorder]);
        await handleUploadAddress(addressId);
        setAddresses([...addresses, { id: addressId, output: fullAddress, preorder: 0 }]);
        setSelectedAddress({ id: addressId, output: fullAddress, preorder: 0 });
        setSelectedVillage("");
        setSelectedStreet("");
        setHouseNumber("");
    };

    const handleUploadAddress = async (addressId: string) => {
        // Save the registration information
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visitOption"], visitOption, [1]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visitTimeFrom"], visitTimeFrom, [2]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visitTimeTo"], visitTimeTo, [3]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "additionalNotes"], additionalNotes, [4]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "contactInfo"], contactInfo, [5]);
        await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "registrationDate"], new Date().toISOString(), [6]);

        // Provide feedback and clear selections
        setFeedback("Bardzo dziękujemy - Twoje zgłoszenie zostało wysłane");
        setSelectedAddress(null);
        setSelectedVillage("");
        setSelectedStreet("");
        setHouseNumber("");
        setVisitOption("");
        setVisitTimeFrom("");
        setVisitTimeTo("");
        setAdditionalNotes("");
        setContactInfo("");
    };

    const generatePreorderValue = (str: string): number => {
        const base = 36; // 26 letters + 10 digits
        const maxCharValue = 10000;
        let value = 0;
        let factor = maxCharValue;

        for (let i = 0; i < str.length; i++) {
            const char = str[i].toLowerCase();
            let charValue;

            if (char >= 'a' && char <= 'z') {
                charValue = char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
            } else if (char >= '0' && char <= '9') {
                charValue = char.charCodeAt(0) - '0'.charCodeAt(0) + 27;
            } else {
                charValue = base; // Special character
            }

            value += charValue * factor;
            factor /= base;
        }

        return value;
    };

    const isAddAddressFormValid = () => {
        return selectedVillage && selectedStreet && houseNumber;
    };

    const isRegistrationFormValid = () => {
        return visitOption && contactInfo;
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
        <div className="visit-register-subpage">
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
                        value={selectedAddress ? selectedAddress.id : ""}
                        onChange={(e) => setSelectedAddress(addresses.find(item => item.id === e.target.value) || null)}
                        className="input-field"
                    >
                        <option value="">--Proszę wybrać adres--</option>
                        {filteredAddresses.slice(0, 10).map((address) => (
                            <option key={address.id} value={address.id}>
                                {address.output}
                            </option>
                        ))}
                    </select>
                    {filteredAddresses.length > 10 && (
                        <p>Proszę zawęzić wyszukiwanie, aby zobaczyć bardziej szczegółowe wyniki.</p>
                    )}
                </div>
            )}
            {searchQuery.length > 5 && filteredAddresses.length === 0 && (
                <div>
                    <p>Nie znaleziono pasującego adresu. Możesz dodać własny adres.</p>
                    <label htmlFor="village-select">Wybierz wieś:</label>
                    <select
                        id="village-select"
                        value={selectedVillage}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        className="input-field"
                    >
                        <option value="">--Proszę wybrać wieś--</option>
                        {Object.keys(villages).map((village) => (
                            <option key={village} value={village}>
                                {village}
                            </option>
                        ))}
                    </select>
                    {selectedVillage && (
                        <>
                            <label htmlFor="street-select">Wybierz ulicę:</label>
                            <select
                                id="street-select"
                                value={selectedStreet}
                                onChange={(e) => setSelectedStreet(e.target.value)}
                                className="input-field"
                            >
                                <option value="">--Proszę wybrać ulicę--</option>
                                {villages[selectedVillage].map((street) => (
                                    <option key={street} value={street}>
                                        {street}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    {selectedStreet && (
                        <>
                            <label htmlFor="house-number">Numer domu:</label>
                            <input
                                id="house-number"
                                type="text"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                                placeholder="Wprowadź numer domu"
                                className="input-field"
                            />
                            {houseNumber && (
                                <button onClick={handleAddAddress} disabled={!isAddAddressFormValid()} className="button">Dodaj adres</button>
                            )}
                            {!isAddAddressFormValid() && <p>Proszę wybrać wieś, ulicę i wprowadzić numer domu, aby dodać adres.</p>}
                        </>
                    )}
                </div>
            )}
            {selectedAddress && !(searchQuery.length > 5 && filteredAddresses.length === 0) && (
                <div>
                    <h3>Wybrany adres:</h3>
                    <p>{selectedAddress.output}</p>
                    {route && (
                        <div>
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
                    <label htmlFor="visit-option">Wybierz opcję wizyty:</label>
                    <select
                        id="visit-option"
                        value={visitOption}
                        onChange={(e) => setVisitOption(e.target.value)}
                        className="input-field"
                    >
                        <option value="">--Proszę wybrać opcję--</option>
                        <option value="Zapraszamy na kolędę w wyznaczonym terminie">Zapraszamy na kolędę w wyznaczonych godzinach</option>
                        <option value="Tego dnia jesteśmy dostępni">W dniu kolędy jesteśmy tylko dostępni w następujących godzinach</option>
                        <option value="Prosimy o kolędę w innym dniu">Prosimy o kolędę w innym dniu</option>
                        <option value="Prosimy o poświęcenie nowego mieszkania/domu">Prosimy o poświęcenie nowego mieszkania/domu</option>
                    </select>
                    {visitOption === "Tego dnia jesteśmy dostępni" && (
                        <>
                            <label htmlFor="visit-time-from">Dostępne od:</label>
                            <input
                                id="visit-time-from"
                                type="time"
                                value={visitTimeFrom}
                                onChange={(e) => setVisitTimeFrom(e.target.value)}
                                className="input-field"
                            />
                            <label htmlFor="visit-time-to">Dostępne do:</label>
                            <input
                                id="visit-time-to"
                                type="time"
                                value={visitTimeTo}
                                onChange={(e) => setVisitTimeTo(e.target.value)}
                                className="input-field"
                            />
                        </>
                    )}
                    <label htmlFor="additional-notes">Ewentualne dodatkowe uwagi:</label>
                    <textarea
                        id="additional-notes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Wprowadź dodatkowe uwagi"
                        className="input-field"
                    />
                    <label htmlFor="contact-info">Telefon lub e-mail (obowiązkowe):</label>
                    <input
                        id="contact-info"
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Wprowadź numer telefonu lub e-mail"
                        className="input-field"
                    />
                    {isRegistrationFormValid() && <button onClick={() => handleUploadAddress(selectedAddress.id)} disabled={!isRegistrationFormValid()} className="button">Zarejestruj wizytę</button>}
                    {!isRegistrationFormValid() && <p>Proszę wybrać opcję wizyty i podać informacje kontaktowe, aby zarejestrować wizytę.</p>}
                </div>
            )}
            {feedback && <p>{feedback}</p>}
        </div>
    );
}