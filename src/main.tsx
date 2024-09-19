import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ManageUser from './components/manage.users.tsx';
import ErrorPage from './components/error-page.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <div>Child 1</div>,
      },
      {
        path: "/users",
        element: <div>Child 2 Users</div>,
      },
    ],
  },
  {
    path: "/manage-users",
    element: <ManageUser />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
