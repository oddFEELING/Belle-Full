import { IconPencilBolt } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React from "react";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Tabs } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

const RestaurantBillingPage = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const { data: restaurant, isPending } = useCachedQuery(
    api.features.restaurants.functions.getRestaurant,
    {
      id: restaurantId,
    }
  );
  return (
    <div className="restaurant-dashboard--page">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <div className="flex w-full flex-col gap-2">
        <h2 className="font-semibold text-2xl">Billing</h2>
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
      <div className="flex w-full flex-col space-y-8" />
    </div>
  );
};

export default RestaurantBillingPage;
