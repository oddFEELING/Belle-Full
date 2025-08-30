import { IconPencilBolt } from "@tabler/icons-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Tabs } from "~/components/ui/tabs";
import { useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { Separator } from "~/components/ui/separator";

const RestaurantBillingPage = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const { data: restaurant, isPending } = useCachedQuery(
    api.features.restaurants.functions.getRestaurant,
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
        <h2 className="text-2xl font-semibold">Billing</h2>
        <div className="-mt-1 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            Manage your restaurant&apos;s billing details.
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
      <div className="flex w-full flex-col space-y-8"></div>
    </div>
  );
};

export default RestaurantBillingPage;
