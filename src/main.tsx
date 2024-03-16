import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createRoutesFromElements,
    RouterProvider,
    Route,
    createHashRouter,
} from "react-router-dom";
import './index.css';
import Root from "./routes/root";
import IntentionPrintPage from './routes/intention-print-page';
import HomePage from './pages/home-page';

const router = createHashRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<HomePage />} />
            <Route path="/intentionprint/:token/:init_date" element={<IntentionPrintPage />} />,
            <Route path="/:token/*" element={<Root/>} />
            </>
            ));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
