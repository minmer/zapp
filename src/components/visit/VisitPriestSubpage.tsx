import { useState, useEffect } from "react";
import Papa from "papaparse";
import { FetchInformationPost } from "../../features/FetchInformationPost";
import { DateOutput, FetchInformationGetAll, NumberOutput, StringOutput } from "../../features/FetchInformationGet";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FetchContext } from "../../features/FetchPostContext";
import { FetchInformationPut } from "../../features/FetchInformationPut";
import { FetchInformationDelete } from "../../features/FetchInformationDelete";

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
    output: string;
    startDateTime: Date;
    endDateTime: Date;
    ministers: ({ id: string, display: string, server: string } | null)[]
;
}

export default function VisitPriestSubpage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<{ id: string, output: string }[]>([]);
    const [search, setSearch] = useState("---");
    const [filteredData, setFilteredData] = useState<{ id: string, output: string }[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [newRouteTitle, setNewRouteTitle] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [routeAddresses, setRouteAddresses] = useState<{ id: string, output: string, order: number, orderid: string }[]>([]);

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
                        minister1[0] ? {
                            ...ministers.find(item => item.id == minister1[0].output), server: minister1[0].id
                        } : null,
                        minister2[0] ? {
                            ...ministers.find(item => item.id == minister2[0].output), server: minister2[0].id
                        } : null,
                        minister3[0] ? {
                            ...ministers.find(item => item.id == minister3[0].output), server: minister3[0].id
                        } : null,
                        minister4[0] ? {
                            ...ministers.find(item => item.id == minister4[0].output), server: minister4[0].id
                        } : null]
                };
            }));

            routesWithMinisters.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
            setRoutes(routesWithMinisters);

        } catch (error) {
            console.error("Failed to fetch routes from server:", error);
        }
    };


    const handleCreateRoute = async () => {
        if (newRouteTitle && startDateTime && endDateTime) {
            const newRoute: Route = { id: "", output: newRouteTitle, startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), ministers: [null, null, null, null] };
            const routeId = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", ["visit_routes"], newRoute.output, [1]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [routeId + "start"], newRoute.startDateTime, [1]);
            await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [routeId + "end"], newRoute.endDateTime, [1]);
            newRoute.id = routeId;
            setRoutes([...routes, newRoute]);
            setSelectedRoute(newRoute);
        }
    };

    useEffect(() => {
        fetchDataFromServer();
        fetchRoutesFromServer();
    }, []);

    useEffect(() => {
        const filtered = data
            .filter((item) =>
                item.output.toLowerCase().startsWith(search.toLowerCase()) &&
                !routeAddresses.some(routeAddress => routeAddress.id === item.id)
            )
            .sort((a, b) => a.output.localeCompare(b.output));
        setFilteredData(filtered);
    }, [search, data, routeAddresses]);


    const formatDateTime = (inputDate: Date) => {
        return new Intl.DateTimeFormat('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(inputDate);
    };


    useEffect(() => {
        const fetchRouteAddresses = async () => {
            if (selectedRoute) {
                try {
                    const fetchedAddresses = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", selectedRoute.id + 'addresses') as StringOutput[];
                    const orderedAddresses = await Promise.all(fetchedAddresses.map(async (address) => {
                        const order = await FetchInformationGetAll("double", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", address.id + selectedRoute.id + "order") as NumberOutput[];
                        if (order.length == 0) {
                            const id = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [address.id + selectedRoute.id + "order"], 0, [1]);
                            return { ...address, order: order[0]?.output || -1, orderid: id as string };
}
                        return { ...address, order: order[0]?.output || -1, orderid: order[0]?.id };
                    }));
                    orderedAddresses.sort((a, b) => a.order - b.order);
                    setRouteAddresses(orderedAddresses);
                } catch (error) {
                    console.error("Failed to fetch route addresses:", error);
                }
            }
        };

        fetchRouteAddresses();
    }, [selectedRoute]);




    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }

        if (source.droppableId === "searchResults" && destination.droppableId === "routeAddresses") {
            // Handle adding address to route
            const newRouteAddresses = Array.from(routeAddresses);
            const movedItem = filteredData[source.index];

            // Check if the item already exists in the route addresses
            const existingIndex = newRouteAddresses.findIndex(item => item.id === movedItem.id);
            if (existingIndex !== -1) {
                // Remove the item if it already exists
                newRouteAddresses.splice(existingIndex, 1);
            } else {
                // Add the item if it does not exist
                await FetchContext("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", selectedRoute.id, "public_writer", movedItem.id + 'route', generatePreorderValue(movedItem.output));
                await FetchContext("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", movedItem.id, "public_writer", selectedRoute.id + 'addresses', generatePreorderValue(movedItem.output));
                const id = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [movedItem.id + selectedRoute.id + "order"], destination.index, [1]);
                newRouteAddresses.splice(destination.index, 0, { ...movedItem, order: 0, orderid: id as string });
            }

            setRouteAddresses(newRouteAddresses);
        } else if (source.droppableId === "routeAddresses" && destination.droppableId === "routeAddresses") {
            // Handle reordering addresses within the route
            const newRouteAddresses = Array.from(routeAddresses);
            const [movedItem] = newRouteAddresses.splice(source.index, 1);
            newRouteAddresses.splice(destination.index, 0, movedItem);
            setRouteAddresses(newRouteAddresses);

            // Update the order information
            await Promise.all(newRouteAddresses.map((item, index) =>
                FetchInformationPut("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", item.orderid, index)
            ));
        }
    };


    // Function to handle deleting an address from the route addresses
    const handleDeleteAddress = async (index: number) => {
        const newRouteAddresses = Array.from(routeAddresses);
        const [removedItem] = newRouteAddresses.splice(index, 1);
        setRouteAddresses(newRouteAddresses);

        // Perform delete operation on the server
        try {
            //await FetchInformationDelete("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", removedItem.id);
        } catch (error) {
            console.error("Failed to delete address from server:", error);
        }
    };
    
    const handleMinisterChange = async (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {


        if (selectedRoute) {
            const newSelectedRoute = { ...selectedRoute };
            const selectedMinisterId = event.target.value;
            const selectedMinister = ministers.find(item => item.id === selectedMinisterId);

            if (newSelectedRoute.ministers[index] == null) {
                const id = await FetchInformationPost("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", [newSelectedRoute.id + `minister${index + 1}`], selectedMinisterId, [1]);

                newSelectedRoute.ministers[index] = {
                    ...selectedMinister,
                    server: id
                };
            } else {
                await FetchInformationPut("bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "public_writer", newSelectedRoute.ministers[index].server, selectedMinisterId);

                newSelectedRoute.ministers[index] = {
                    ...selectedMinister,
                    server: newSelectedRoute.ministers[index].server
                };
            }

            setSelectedRoute(newSelectedRoute);
            setRoutes(routes.map(route => route.id === newSelectedRoute.id ? newSelectedRoute : route));
        }
    };




    return (
        <div className='visit_priest'>
            <select value={selectedRoute?.id || ""} onChange={(e) => setSelectedRoute(routes.find(item => item.id === e.target.value) || null)}>
                <option value="">Create new route</option>
                {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                        {`${route.output} (${formatDateTime(route.startDateTime)} - ${formatDateTime(route.endDateTime)})`}
                    </option>
                ))}
            </select>
            {selectedRoute == null && (
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
            {selectedRoute && (
                <div className="minister-pairs">
                    <h3>Assign Ministers</h3>
                    <select value={selectedRoute.ministers[0]?.id || ""} onChange={(e) => handleMinisterChange(e, 0)}>
                        <option value="">Select Minister 1</option>
                        {ministers.map((minister) => (
                            <option key={minister.id} value={minister.id}>
                                {minister.display}
                            </option>
                        ))}
                    </select>
                    <select value={selectedRoute.ministers[1]?.id || ""} onChange={(e) => handleMinisterChange(e, 1)}>
                        <option value="">Select Minister 2</option>
                        {ministers.map((minister) => (
                            <option key={minister.id} value={minister.id}>
                                {minister.display}
                            </option>
                        ))}
                    </select>
                    <select value={selectedRoute.ministers[2]?.id || ""} onChange={(e) => handleMinisterChange(e, 2)}>
                        <option value="">Select Minister 3</option>
                        {ministers.map((minister) => (
                            <option key={minister.id} value={minister.id}>
                                {minister.display}
                            </option>
                        ))}
                    </select>
                    <select value={selectedRoute.ministers[3]?.id || ""} onChange={(e) => handleMinisterChange(e, 3)}>
                        <option value="">Select Minister 4</option>
                        {ministers.map((minister) => (
                            <option key={minister.id} value={minister.id}>
                                {minister.display}
                            </option>
                        ))}
                    </select>
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
            <div className="container">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="searchResults">
                        {(provided) => (
                            <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                                <h3>Search Results</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Adres</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + 'a'} index={index}>
                                                {(provided) => (
                                                    <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <td>{item.output}</td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="routeAddresses">
                        {(provided) => (
                            <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                                <h3>Route Addresses</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Adres</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routeAddresses.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + 'b'} index={index}>
                                                {(provided) => (
                                                    <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <td>{item.output}</td>
                                                        <td>
                                                            <button onClick={() => handleDeleteAddress(index)}>X</button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );





}