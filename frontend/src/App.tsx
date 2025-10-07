import { RouterProvider, createBrowserRouter } from "react-router";
import LoginPage from "./pages/auth/login";
import ProtectedRoute from "./utils/ProtectedRoute";
import TicketsListPage from "./pages/tickets/list";
import TicketDetailPage from "./pages/tickets/detail";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>Home Page - Protected Content</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute>
        <TicketsListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets/:id",
    element: (
      <ProtectedRoute>
        <TicketDetailPage />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/customers",
  //   element: (
  //     <Protected roles={["ADMIN", "CUSTOMER_SERVICE"]}>
  //       <CustomersList />
  //     </Protected>
  //   ),
  // },
  // {
  //   path: "/customers/new",
  //   element: (
  //     <Protected roles={["ADMIN", "CUSTOMER_SERVICE"]}>
  //       <CustomerForm />
  //     </Protected>
  //   ),
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
