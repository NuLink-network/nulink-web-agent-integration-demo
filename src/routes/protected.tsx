import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { MainLayout } from "@/components/Layout";
import { lazyImport } from "@/utils/lazyImport";

const { Dashboard } = lazyImport(() => import("@/features/misc"), "Dashboard");
const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div>
            App in protected routes
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: "/app",
    element: <App />,
    children: [

      { path: "", element: <Dashboard /> },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
