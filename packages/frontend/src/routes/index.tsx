import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { HomePage } from "../pages/Home";
import { DeviceQueryPage } from "../pages/DeviceQuery";
import { CapabilityQueryPage } from "../pages/CapabilityQuery";
import { NotFoundPage } from "../pages/NotFound";
import { TestCodegen } from "../components/test/TestCodegen";
import { ComponentShowcase } from '../pages/ComponentShowcase';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "device",
        element: <DeviceQueryPage />,
      },
      {
        path: 'showcase',
        element: <ComponentShowcase />,
      },
      {
        path: "capability",
        element: <CapabilityQueryPage />,
      },
      {
        path: "test",
        element: <TestCodegen />,
      },
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
