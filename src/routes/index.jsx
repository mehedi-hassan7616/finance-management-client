import { createBrowserRouter } from "react-router-dom";

// layouts
import AuthLayout from "@/layouts/auth-layout";
import MainLayout from "@/layouts/main-layout";

// components
import PrivateRoute from "@/components/private-route";

// pages
import HomePage from "@/pages/home";
import AddTransactionPage from "@/pages/add-transaction";
import TransactionsPage from "@/pages/transactions";
import TransactionDetailsPage from "@/pages/transaction-details";
import ReportsPage from "@/pages/reports";
import MyProfilePage from "@/pages/my-profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import NotFoundPage from "@/pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/add-transaction",
        element: (
          <PrivateRoute>
            <AddTransactionPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <PrivateRoute>
            <TransactionsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/transactions/:id",
        element: (
          <PrivateRoute>
            <TransactionDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <MyProfilePage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
