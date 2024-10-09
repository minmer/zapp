import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createRoutesFromElements,
    RouterProvider,
    Route,
    createHashRouter,
} from "react-router-dom";
import './index.css';
import './recreatio.css';
import Root from "./root";
import IntentionPrintPage from './routes/intention-print-page';
import HomePage from './pages/home-page';
import ObitIntentionsPrint from './components/obit-intentions-print-component';
import SignInPage from './pages/signin-page';
import PrintPage from './pages/print-page';


const router = createHashRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<HomePage />} />
            <Route path="/print/:token/intentionweek/:init_date" element={<IntentionPrintPage />} />,
            <Route path="/print/:token/obitintentions/:obit" element={<ObitIntentionsPrint />} />,
            <Route path="/print/*" element={<PrintPage />} />
            <Route path="/zielonki/*" element={<Root />} />
            <Route path="/signin/:entry" element={<SignInPage />} />
            <Route path="/signin/:entry/:token" element={<SignInPage />} />
            </>
            ));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
