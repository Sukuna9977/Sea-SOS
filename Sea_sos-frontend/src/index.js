import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// router
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
// reducer
import { setAuthState } from "./store/authSlice";
import { initializeAuth } from './store/authSlice';
import ProtectedAuthRoute from './routes/ProtectedAuthRoute';

import { store } from './store';

// Import your components
const Google = React.lazy(() => import("./views/dashboard/maps/google"));
const Default = React.lazy(() => import("./layouts/dashboard/default"));
const UserList = React.lazy(() => import("./views/dashboard/app/user-list"));
const PatrolList = React.lazy(() => import("./views/dashboard/app/patrol-list"));
const BoatList = React.lazy(() => import("./views/dashboard/app/boat-list"));
const Recoverpw = React.lazy(() => import("./views/dashboard/auth/recoverpw"));
const Resetpwd = React.lazy(() => import("./views/dashboard/auth/resetpwd"));
const Error404 = React.lazy(() => import("./views/dashboard/errors/error404"));
const SignIn = React.lazy(() => import("./views/dashboard/auth/sign-in"));
const Dashboard = React.lazy(() => import("./views/dashboard/dashboard"));
const EnclosedMissionsHistory = React.lazy(() => import("./views/dashboard/app/enclosed-missions-history"));

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/auth/sign-in" />;
};

const router = createBrowserRouter([
  {
    path: '*',
    element: <Error404 />,
  },
  {
    path: '/',
    element: <PrivateRoute element={<Default />}/>,
    children: [
      {
        path: '',
        element: <Google />,
      },
      {
        path: 'user-list',
        element: <UserList />,
      },
      {
        path: 'patrol-list',
        element: <PatrolList />,
      },
      {
        path: 'boat-list',
        element: <BoatList />,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: 'enclosed-missions-history',
        element: <PrivateRoute element={<EnclosedMissionsHistory />} />,
      },
    ],
  },
  {
    path: 'auth/sign-in',
    element: <ProtectedAuthRoute element={<SignIn />} />,
  },
  {
    path: 'auth/reset-password',
    element: <ProtectedAuthRoute element={<Recoverpw />} />,
  },
  {
    path: 'resetpwd/:token',
    element: <ProtectedAuthRoute element={<Resetpwd />} />,
  },
], { basename: process.env.PUBLIC_URL });

// Create a wrapper component that initializes auth
const AppWrapper = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize auth when component mounts
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <App>
      <Suspense fallback={<h1>Loading...</h1>}>
        <RouterProvider router={router}></RouterProvider>
      </Suspense>
    </App>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
