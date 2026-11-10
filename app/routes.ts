import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("room/:code", "routes/lobby.tsx"),route("room/:code/match", "routes/match.tsx")] satisfies RouteConfig;
