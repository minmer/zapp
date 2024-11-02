import { Link, Route, Routes} from 'react-router-dom';
import baner from '../assets/trip.jpg'
import { useEffect, useState } from 'react';
import { User } from '../structs/user';
import EditableElement from '../generals/editable-element';
import TripDetailSubpage from '../components/trip/trip-detail-subpage';
import { FetchInformationGetAll, StringOutput } from '../features/FetchInformationGet';
export default function TripPage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    const [trips, setTrips] = useState<StringOutput[]>([])

    useEffect(() => {
        (async function () {
            setTrips((await FetchInformationGetAll('string', 'zyWJot_ATD3c3ac7dzSer30IY2pldF5K06erG2tq_fc', 'trip')) as unknown as StringOutput[])
        }());
    }, [getParams])

    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Wycieczki</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        {trips.map(trip => (
                            <li key={trip.id}>
                                <Link to={trip.id}>{trip.output}</Link>
                            </li>
                        ))}
                        <div className="clear"></div>
                    </ul>
                </div>
                <EditableElement getParams={getParams} editable={
                    {
                        name: 'trip',
                        type: 'text',
                        multiple: true,
                        description: 'Trips',
                        dbkey: 'website_admin',
                        showdescription: false,
                        display: 'single',
                    }} />
                <Routes>
                    <Route path=":trip" element={<TripDetailSubpage getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Zapisy na wyjazdy</li>
                        <li>Sprawdzenie informacji o wyjeździe</li>
                        <li>Podanie danych osobowych</li>
                        <li>Sprawdzenie ilości osób zapisanych</li>
                    </ul>
                </div>
            </div>
        </>
    );
}