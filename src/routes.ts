import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("users", "routes/users+/_layout.tsx", [
        route(":id", "routes/users+/$id.detailes.tsx"),
    ]),
] satisfies RouteConfig;
