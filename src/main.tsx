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
import ErrorPage from "./routes/error-page";
import FinancePage from "./routes/finance-page";
import LoginPage from './routes/login-page';
import IntentionPage from './routes/intention-page';
import IntentionPrintPage from './routes/intention-print-page';

const router = createHashRouter(
            createRoutesFromElements(

                <Route path="/" element={<LoginPage />} >,
                    <Route path="/intentionprint/:token/:init_date" element={<IntentionPrintPage />} />,
                    <Route path="/:token" element={<Root />} >,
                        <Route
                            path="intention/*"
                            element={<IntentionPage />}
                            errorElement={<ErrorPage />}
                        />
                        <Route
                            path="finance/:context"
                            element={<FinancePage />}
                            errorElement={<ErrorPage />}
                        />
                    </Route>
                </Route>
            ));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
