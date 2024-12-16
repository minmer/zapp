import { useState, useEffect } from "react";
import Papa from "papaparse";
import { FetchInformationPost } from "../../features/FetchInformationPost";
import { FetchInformationGetAll, StringOutput } from "../../features/FetchInformationGet";

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

export default function VisitPriestSubpage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<VisitData[]>([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState<VisitData[]>([]);

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

        setData(processedData);

        // Save the data to the server
        
        processedData.forEach(async (row, index) => {
            await sleep(250 * index);

            const { address, lastName, husbandName, husbandBirthPlace, wifeName, wifeBirthDate, wifeBirthPlace, marriageDate, marriageType, marriageParish, children, otherFamilyMembers, additionalInfo, visit2011, visit2012, visit2013, visit2014, visit2015, visit2016, visit2017, visit2018, visit2019, visit2020, visit2021, visit2022, visit2023, visit2024 } = row;

            // Generate preorder value for the address
            const preorder = generatePreorderValue(address);
            console.log(index)
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
    }; const fetchDataFromServer = async () => {
        try {
            const fetchedData = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", "visit_adresses_03") as StringOutput[];

            const processedData: VisitData[] = await Promise.all(fetchedData.map(async (item) => {
                const addressId = item.id;
                const address = item.output;
                const preorder = item.preorder;
                const lastName = {output: ""};
                const husbandName = { output: "" };
                const husbandBirthPlace = { output: "" };
                const wifeName = { output: "" };
                const wifeBirthDate = { output: "" };
                const wifeBirthPlace = { output: "" };
                const marriageDate = { output: "" };
                const marriageType = { output: "" };
                const marriageParish = { output: "" };
                const children = { output: "" };
                const otherFamilyMembers = { output: "" };
                const additionalInfo = { output: "" };
                const visit2011 = { output: "" };
                const visit2012 = { output: "" };
                const visit2013 = { output: "" };
                const visit2014 = { output: "" };
                const visit2015 = { output: "" };
                const visit2016 = { output: "" };
                const visit2017 = { output: "" };
                const visit2018 = { output: "" };
                const visit2019 = { output: "" };
                const visit2020 = { output: "" };
                const visit2021 = { output: "" };
                const visit2022 = { output: "" };
                const visit2023 = { output: "" };
                const visit2024 = { output: "" };


                // const lastName = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}lastName`) as StringOutput[];
                // const husbandName = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}husbandName`) as StringOutput[];
                // const husbandBirthPlace = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}husbandBirthPlace`) as StringOutput[];
                // const wifeName = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}wifeName`) as StringOutput[];
                // const wifeBirthDate = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}wifeBirthDate`) as StringOutput[];
                // const wifeBirthPlace = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}wifeBirthPlace`) as StringOutput[];
                // const marriageDate = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}marriageDate`) as StringOutput[];
                // const marriageType = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}marriageType`) as StringOutput[];
                // const marriageParish = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}marriageParish`) as StringOutput[];
                // const children = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}children`) as StringOutput[];
                // const otherFamilyMembers = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}otherFamilyMembers`) as StringOutput[];
                // const additionalInfo = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}additionalInfo`) as StringOutput[];
                // const visit2011 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2011`) as StringOutput[];
                // const visit2012 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2012`) as StringOutput[];
                // const visit2013 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2013`) as StringOutput[];
                // const visit2014 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2014`) as StringOutput[];
                // const visit2015 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2015`) as StringOutput[];
                // const visit2016 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2016`) as StringOutput[];
                // const visit2017 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2017`) as StringOutput[];
                // const visit2018 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2018`) as StringOutput[];
                // const visit2019 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2019`) as StringOutput[];
                // const visit2020 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2020`) as StringOutput[];
                // const visit2021 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2021`) as StringOutput[];
                // const visit2022 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2022`) as StringOutput[];
                // const visit2023 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2023`) as StringOutput[];
                // const visit2024 = await FetchInformationGetAll("string", "bpBDPPqY_SwBZ7LTCGqcd51zxCKiO0Oi67tmEA8Uz8U", `${addressId}visit2024`) as StringOutput[];

                return {
                    address,
                    lastName: lastName[0]?.output || "",
                    husbandName: husbandName[0]?.output || "",
                    husbandBirthPlace: husbandBirthPlace[0]?.output || "",
                    wifeName: wifeName[0]?.output || "",
                    wifeBirthDate: wifeBirthDate[0]?.output || "",
                    wifeBirthPlace: wifeBirthPlace[0]?.output || "",
                    marriageDate: marriageDate[0]?.output || "",
                    marriageType: marriageType[0]?.output || "",
                    marriageParish: marriageParish[0]?.output || "",
                    children: children[0]?.output || "",
                    otherFamilyMembers: otherFamilyMembers[0]?.output || "",
                    additionalInfo: additionalInfo[0]?.output || "",
                    visit2011: visit2011[0]?.output || "N",
                    visit2012: visit2012[0]?.output || "N",
                    visit2013: visit2013[0]?.output || "N",
                    visit2014: visit2014[0]?.output || "N",
                    visit2015: visit2015[0]?.output || "N",
                    visit2016: visit2016[0]?.output || "N",
                    visit2017: visit2017[0]?.output || "N",
                    visit2018: visit2018[0]?.output || "N",
                    visit2019: visit2019[0]?.output || "N",
                    visit2020: visit2020[0]?.output || "N",
                    visit2021: visit2021[0]?.output || "N",
                    visit2022: visit2022[0]?.output || "N",
                    visit2023: visit2023[0]?.output || "N",
                    visit2024: visit2024[0]?.output || "N",
                };
            }));

            setData(processedData);
        } catch (error) {
            console.error("Failed to fetch data from server:", error);
        }
    };



    useEffect(() => {
        fetchDataFromServer();
    }, []);

    useEffect(() => {
        const filtered = data.filter((item) =>
            item.address.toLowerCase().startsWith(search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [search, data]);
    return (
        <div>
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
                        <th>Nazwisko</th>
                        <th>Imię męża</th>
                        <th>Miejsce ur. męża</th>
                        <th>Imię żony</th>
                        <th>Data ur. żony</th>
                        <th>Miejsce ur. żony</th>
                        <th>Data ślubu</th>
                        <th>Rodzaj ślubu</th>
                        <th>Parafia ślubu</th>
                        <th>Dzieci (imiona, wiek)</th>
                        <th>Inne osoby w rodzinie</th>
                        <th>Informacja (1)</th>
                        <th>Kolęda 2011</th>
                        <th>Kolęda 2012</th>
                        <th>Kolęda 2013</th>
                        <th>Kolęda 2014</th>
                        <th>Kolęda 2015</th>
                        <th>Kolęda 2016</th>
                        <th>Kolęda 2017</th>
                        <th>Kolęda 2018</th>
                        <th>Kolęda 2019</th>
                        <th>Kolęda 2020</th>
                        <th>Kolęda 2021</th>
                        <th>Kolęda 2022</th>
                        <th>Kolęda 2023</th>
                        <th>Kolęda 2024</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.address}</td>
                            <td>{item.lastName}</td>
                            <td>{item.husbandName}</td>
                            <td>{item.husbandBirthPlace}</td>
                            <td>{item.wifeName}</td>
                            <td>{item.wifeBirthDate}</td>
                            <td>{item.wifeBirthPlace}</td>
                            <td>{item.marriageDate}</td>
                            <td>{item.marriageType}</td>
                            <td>{item.marriageParish}</td>
                            <td>{item.children}</td>
                            <td>{item.otherFamilyMembers}</td>
                            <td>{item.additionalInfo}</td>
                            <td>{item.visit2011}</td>
                            <td>{item.visit2012}</td>
                            <td>{item.visit2013}</td>
                            <td>{item.visit2014}</td>
                            <td>{item.visit2015}</td>
                            <td>{item.visit2016}</td>
                            <td>{item.visit2017}</td>
                            <td>{item.visit2018}</td>
                            <td>{item.visit2019}</td>
                            <td>{item.visit2020}</td>
                            <td>{item.visit2021}</td>
                            <td>{item.visit2022}</td>
                            <td>{item.visit2023}</td>
                            <td>{item.visit2024}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
