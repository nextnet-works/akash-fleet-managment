import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
///
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Loader } from "./components/Loader";
import { routeTree } from "./routeTree.gen";
import { ErrorUI } from "./components/Error";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <Loader />,
  defaultErrorComponent: ({ error }) => <ErrorUI message={error.message} />,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
