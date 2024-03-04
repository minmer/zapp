import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import FinancePage from "./routes/finance-page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
        {
            path: "finance/:context",
            element: <FinancePage />,
        },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
