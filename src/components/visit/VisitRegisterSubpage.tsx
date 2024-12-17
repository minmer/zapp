import { useState, useEffect } from "react";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";
import { FetchInformationPost } from "../../features/FetchInformationPost";

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
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [selectedVillage, setSelectedVillage] = useState<string>("");
    const [selectedStreet, setSelectedStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [visitOption, setVisitOption] = useState<string>("");
    const [visitTimeFrom, setVisitTimeFrom] = useState<string>("");
    const [visitTimeTo, setVisitTimeTo] = useState<string>("");
    const [additionalNotes, setAdditionalNotes] = useState<string>("");
    const [contactInfo, setContactInfo] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");

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

    const handleAddAddress = async () => {
        const fullAddress = `${selectedVillage} ${selectedStreet} ${houseNumber}`;
        const preorder = generatePreorderValue(fullAddress);
        const addressId = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["visit_adresses_03"], fullAddress, [preorder]);
        await handleUploadAddress(addressId);
        setAddresses([...addresses, { id: addressId, output: fullAddress, preorder: 0 }]);
        setSelectedAddress(fullAddress);
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
        setSelectedAddress("");
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
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
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
                    <p>{selectedAddress}</p>
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
                    {isRegistrationFormValid() && <button onClick={() => handleUploadAddress(selectedAddress)} disabled={!isRegistrationFormValid()} className="button">Zarejestruj wizytę</button>}
                    {!isRegistrationFormValid() && <p>Proszę wybrać opcję wizyty i podać informacje kontaktowe, aby zarejestrować wizytę.</p>}
                </div>
            )}
            {feedback && <p>{feedback}</p>}
        </div>
    );
}
