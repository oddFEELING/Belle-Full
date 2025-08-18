import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/_root.layout.tsx", [
    index("routes/home.tsx"),

    // ~ ======= Auth routes ======= ~
    layout("routes/Auth/_auth.layout.tsx", [
      route("/register", "routes/Auth/register.tsx"),
    ]),

    // ~ ======= Brand routes ======= ~
    ...prefix("brands", [
      layout("routes/Brands/_brand.layout.tsx", [
        route("/create", "routes/Brands/brand.create.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
