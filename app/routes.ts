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
    ...prefix("/brands", [
      layout("routes/Brands/_brand.layout.tsx", [
        route("/create", "routes/Brands/brand.create.tsx"),

        // ~ ======= Brand hub ======= ~
        ...prefix("/hub/:brandId", [
          layout("routes/Brands/brand-hub/_brand.hub.layout.tsx", [
            index("routes/Brands/brand-hub/index.tsx"),
            route(
              "/restaurants",
              "routes/Brands/brand-hub/brand.restaurants.tsx",
            ),
            route("/people", "routes/Brands/brand-hub/brand.people.tsx"),
            route("/manage", "routes/Brands/brand-hub/brand.manage.tsx"),
            route(
              "/ai-description",
              "routes/Brands/brand-hub/brand.ai-description.tsx",
            ),
          ]),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
