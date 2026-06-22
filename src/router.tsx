import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const getBasepath = () => {
  const base = import.meta.env.BASE_URL || "/";
  const trimmedBase = base.replace(/^\/+|\/+$/g, "");

  return trimmedBase ? `/${trimmedBase}` : "/";
};

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    basepath: getBasepath(),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
