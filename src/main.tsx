import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import './i18n'; // Initialize i18next
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProtectedRoutes } from "@/components/ProtectedRoutes";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { AnalyticsPage } from "@/pages/dashboard/AnalyticsPage";
import { MeetingAnalysisPage } from "@/pages/dashboard/MeetingAnalysisPage";
import { BillingPage } from "@/pages/dashboard/BillingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dashboard/analytics",
        element: <AnalyticsPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dashboard/settings",
        element: <SettingsPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dashboard/meeting-analysis",
        element: <MeetingAnalysisPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dashboard/billing",
        element: <BillingPage />,
        errorElement: <RouteErrorBoundary />,
      },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)