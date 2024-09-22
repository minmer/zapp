import { Link, Route, Routes } from 'react-router-dom';
import baner from '../assets/choir.jpg'
import ChoirOverviewSubpage from '../components/choir/choir-overview-subpage';
import ChoirPreparationSubpage from '../components/choir/choir-preparation-subpage';
import ChoirMassSubpage from '../components/choir/choir-mass-subpage';
import ChoirScoresSubpage from '../components/choir/choir-scores-subpage';
export default function ChoirPage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>; type: string; show: boolean; }) => Promise<unknown>; }) {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Chór mieszany</h1>
                    </div>
                </div>
                <div className="tabs">
                    <ul>
                        <li>
                            <Link to={`overview`}>Ogólne informacje</Link>
                        </li>
                        <li>
                            <Link to={`preparation`}>Próby</Link>
                        </li>
                        <li>
                            <Link to={`mass`}>Msze Śpiewane</Link>
                        </li>
                        <li>
                            <Link to={`scores`}>Repertuar</Link>
                        </li>
                        <div className="clear"></div>
                    </ul>
                </div>
                <Routes>
                    <Route path="overview" element={<ChoirOverviewSubpage getParams={getParams} />} />
                    <Route path="preparation" element={<ChoirPreparationSubpage getParams={getParams} />} />
                    <Route path="mass" element={<ChoirMassSubpage getParams={getParams} />} />
                    <Route path="scores" element={<ChoirScoresSubpage getParams={getParams} />} />
                </Routes>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Terminy najbliższych prób i śpiewów</li>
                        <li>Repertuar na każdy śpiew</li>
                        <li>Nuty do pobrania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}