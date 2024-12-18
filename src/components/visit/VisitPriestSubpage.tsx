import { useState, useEffect } from "react";
import Papa from "papaparse";
import { FetchInformationPost } from "../../features/FetchInformationPost";
import { DateOutput, FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";

interface VisitData {
    address: string;
    lastName: string;
    husbandName: string;
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
    title: string;
    startDateTime: Date;
    endDateTime: Date;
}

export default function VisitPriestSubpage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<{ id: string, output: string }[]>([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState<{ id: string, output: string }[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [newRouteTitle, setNewRouteTitle] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    processCSVData(results.data);
                },
            });
        }
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const processCSVData = (data: any[]) => {
        const processedData: VisitData[] = data.map((row) => ({
            address: row["Adres"] || " ",
            lastName: row["Nazwisko"] || " ",
            husbandName: row["Imię męża"] || " ",
            husbandBirthPlace: row["Miejsce ur. męża"] || " ",
            wifeName: row["Imię żony"] || " ",
            wifeBirthDate: row["Data ur. żony"] || " ",
            wifeBirthPlace: row["Miejsce ur. żony"] || " ",
            marriageDate: row["Data ślubu"] || " ",
            marriageType: row["Rodzaj ślubu"] || " ",
            marriageParish: row["Parafia ślubu"] || " ",
            children: row["Dzieci (imiona wiek)"] || " ",
            otherFamilyMembers: row["Inne osoby w rodzinie"] || " ",
            additionalInfo: row["Informacja (1)"] || " ",
            visit2011: row["Kolęda 2011"] || "N",
            visit2012: row["Kolęda 2012"] || "N",
            visit2013: row["Kolęda 2013"] || "N",
            visit2014: row["Kolęda 2014"] || "N",
            visit2015: row["Kolęda 2015"] || "N",
            visit2016: row["Kolęda 2016"] || "N",
            visit2017: row["Kolęda 2017"] || "N",
            visit2018: row["Kolęda 2018"] || "N",
            visit2019: row["Kolęda 2019"] || "N",
            visit2020: row["Kolęda 2020"] || "N",
            visit2021: row["Kolęda 2021"] || "N",
            visit2022: row["Kolęda 2022"] || "N",
            visit2023: row["Kolęda 2023"] || "N",
            visit2024: row["Kolęda 2024"] || "N",
        }));

        setData(processedData.map(item => ({ id: '', output: item.address })));

        // Save the data to the server
        processedData.forEach(async (row, index) => {
            await sleep(250 * index);

            const { address, lastName, husbandName, husbandBirthPlace, wifeName, wifeBirthDate, wifeBirthPlace, marriageDate, marriageType, marriageParish, children, otherFamilyMembers, additionalInfo, visit2011, visit2012, visit2013, visit2014, visit2015, visit2016, visit2017, visit2018, visit2019, visit2020, visit2021, visit2022, visit2023, visit2024 } = row;

            // Generate preorder value for the address
            const preorder = generatePreorderValue(address);

            // Save the main address information
            const addressId = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["visit_adresses_03"], address, [preorder]);

            // Save the child information
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "lastName"], lastName, [1]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "husbandName"], husbandName, [2]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "husbandBirthPlace"], husbandBirthPlace, [3]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "wifeName"], wifeName, [4]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "wifeBirthDate"], wifeBirthDate, [5]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "wifeBirthPlace"], wifeBirthPlace, [6]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "marriageDate"], marriageDate, [7]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "marriageType"], marriageType, [8]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "marriageParish"], marriageParish, [9]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "children"], children, [10]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "otherFamilyMembers"], otherFamilyMembers, [11]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "additionalInfo"], additionalInfo, [12]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2011"], visit2011, [13]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2012"], visit2012, [14]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2013"], visit2013, [15]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2014"], visit2014, [16]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2015"], visit2015, [17]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2016"], visit2016, [18]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2017"], visit2017, [19]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2018"], visit2018, [20]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2019"], visit2019, [21]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2020"], visit2020, [22]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2021"], visit2021, [23]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2022"], visit2022, [24]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2023"], visit2023, [25]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [addressId + "visit2024"], visit2024, [26]);
        });
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

    const fetchDataFromServer = async () => {
        try {
            const fetchedData = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_adresses_03") as StringOutput[];

            setData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch data from server:", error);
        }
    };

    const fetchRoutesFromServer = async () => {
        try {
            const fetchedRoutes = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_routes") as StringOutput[];
            const preparedRoutes = await Promise.all(fetchedRoutes.map(async item => ({
                id: item.id,
                title: item.output,
                startDateTime: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_routes") as DateOutput[])[0]?.output,
                endDateTime: (await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_routes") as DateOutput[])[0]?.output,
            })))

            setRoutes(preparedRoutes);
        } catch (error) {
            console.error("Failed to fetch routes from server:", error);
        }
    };

    const handleCreateRoute = async () => {
        if (newRouteTitle && startDateTime && endDateTime) {
            const newRoute: Route = { id: "", title: newRouteTitle, startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime) };
            const routeId = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["visit_routes"], newRoute.title, [1]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [routeId + "start"], newRoute.startDateTime, [1]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [routeId + "end"], newRoute.endDateTime, [1]);
            newRoute.id = routeId;
            setRoutes([...routes, newRoute]);
            setSelectedRoute(routeId);
        }
    };

    useEffect(() => {
        fetchDataFromServer();
        fetchRoutesFromServer();
    }, []);

    useEffect(() => {
        const filtered = data.filter((item) =>
            item.output.toLowerCase().startsWith(search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [search, data]);

    return (
        <div>
            <select value={selectedRoute || ""} onChange={(e) => setSelectedRoute(e.target.value)}>
                <option value="">Create new route</option>
                {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                        {route.title}
                    </option>
                ))}
            </select>
            {selectedRoute === "" && (
                <div>
                    <input
                        type="text"
                        placeholder="Route title"
                        value={newRouteTitle}
                        onChange={(e) => setNewRouteTitle(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        placeholder="Start date and time"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        placeholder="End date and time"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                    />
                    <button onClick={handleCreateRoute}>Create Route</button>
                </div>
            )}
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <input
                type="text"
                placeholder="Search by address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Adres</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.output}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
