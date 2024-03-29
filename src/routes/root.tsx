import { Route, Routes } from "react-router-dom";
import MenuComponent from "../components/menu-component";
import RootPage from "../pages/root-page";
import BaptismPage from "../pages/baptism-page";
import ConfirmationPage from "../pages/confirmation-page";
import UnctionPage from "../pages/unction-page";
import ObitPage from "../pages/obit-page";
import MinisterPage from "../pages/minister-page";
import FinancePage from "../pages/finance-page";
import ConfessionPage from "../pages/confession-page";
import CommunionPage from "../pages/communion-page";
import ChoirPage from "../pages/choir-page";
import BibleCirclePage from "../pages/bible_circle-page";
import PursuitSaintPage from "../pages/pursuit_saint-page";
import IntentionPage from "../pages/intention-page";
export default function Root() {
    
    return (
        <>
            <MenuComponent />
            <Routes>
                <Route path="/" element={<RootPage />} />
                <Route path="/baptism" element={<BaptismPage />} />
                <Route path="/bible_circle" element={<BibleCirclePage />} />
                <Route path="/choir" element={<ChoirPage />} />
                <Route path="/communion" element={<CommunionPage />} />
                <Route path="/confession" element={<ConfessionPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/intention/*" element={<IntentionPage />} />
                <Route path="/minister" element={<MinisterPage />} />
                <Route path="/obit" element={<ObitPage />} />
                <Route path="/pursuit_saint" element={<PursuitSaintPage />} />
                <Route path="/unction" element={<UnctionPage />} />
            </Routes>
        </>
    );
}