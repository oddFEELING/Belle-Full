import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/(Auth)/_auth.layout.tsx", [
    route("/register", "routes/(Auth)/register.tsx"),
  ]),
] satisfies RouteConfig;
