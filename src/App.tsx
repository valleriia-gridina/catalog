import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "pages/ErrorPage/ErrorPage";
import UsersPage from "pages/UsersPage/UsersPage";
import CompaniesPage from "pages/CompaniesPage/CompaniesPage";
import MainLayout from "layouts/MainLayout";
import UserPage from "pages/UserPage/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: "companies",
        element: <CompaniesPage />,
      },
      {
        path: "/users/:id",
        element: <UserPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// add edit button for user
// add users amount for end point (lazy loading, number)
// address, add input + map (pin) validation инпут с гугл мап библ + валидация
// only europe - разрешенные зоны
// точный адрес с тултипом
