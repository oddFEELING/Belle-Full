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
      route("/signin", "routes/Auth/signin.tsx"),
    ]),

    // ~ ======= Brand routes ======= ~
    ...prefix("/brands/:brandId", [
      layout("routes/Brands/_brand.layout.tsx", [
        route("/create", "routes/Brands/brand.create.tsx"),

        // ~ ======= Brand hub ======= ~
        ...prefix("/hub", [
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

        // ~ ======= Restaurant routes ======= ~
        ...prefix("/restaurants/:restaurantId", [
          layout("routes/Brands/restaurants/_restaurant.layout.tsx", [
            index("routes/Brands/restaurants/restaurant.overview.tsx"),
            route("/menu", "routes/Brands/restaurant.menu/index.tsx"),

            route(
              "/menu/add-menu-item",
              "routes/Brands/restaurant.menu/add.menu.item.tsx",
            ),

            route("/orders", "routes/Brands/restaurants/restaurant.orders.tsx"),

            route("/staff", "routes/Brands/restaurants/restaurant.staff.tsx"),

            route(
              "/bellebot",
              "routes/Brands/restaurants/restaurant.bellebot.tsx",
            ),

            route("/agents", "routes/Brands/restaurant.agents/index.tsx"),
            route(
              "/agents/:agentId",
              "routes/Brands/restaurant.agents/[id].tsx",
            ),
            route(
              "/agents/:agentId/editor",
              "routes/Brands/restaurant.agents/agent.editor.tsx",
            ),

            route(
              "/transactions",
              "routes/Brands/restaurants/restaurant.transactions.tsx",
            ),

            route(
              "/billing",
              "routes/Brands/restaurants/restaurant.billing.tsx",
            ),

            route(
              "/legal-documents",
              "routes/Brands/restaurants/restaurant.legal-documents.tsx",
            ),
          ]),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
