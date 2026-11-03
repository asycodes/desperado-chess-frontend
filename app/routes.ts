import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("room/:code", "routes/lobby.tsx"),] satisfies RouteConfig;
