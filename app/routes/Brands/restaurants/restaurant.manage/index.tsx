import { IconPencilBolt } from "@tabler/icons-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Tabs } from "~/components/ui/tabs";
import ManageDetails from "./partials/manage.details";
import { useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { Separator } from "~/components/ui/separator";

const RestaurantManagePage = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const { data: restaurant, isPending } = useCachedQuery(
    api.restaurants.functions.getRestaurant,
    {
      id: restaurantId,
    },
  );
  return (
    <div className="restaurant-dashboard--page">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-2xl font-semibold">Manage Restaurant</h2>
        <div className="-mt-1 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            Manage your restaurants and their details.
          </span>

          <Button variant="ghost">
            <IconPencilBolt size={16} strokeWidth={1.5} />
            <span> Edit</span>
          </Button>
        </div>
      </div>
      <Separator className="my-2" />

      {/* ~ =================================== ~ */}
      {/* -- Body -- */}
      {/* ~ =================================== ~ */}
      <div className="flex w-full flex-col space-y-8">
        {restaurant && <ManageDetails restaurant={restaurant} />}
      </div>
    </div>
  );
};

export default RestaurantManagePage;
