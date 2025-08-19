import { IconBuildingStore, IconChefHat } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import { useParams } from "react-router";
import { CreateRestaurantPanel } from "~/components/panels/create.restaurant.panel";
import { Button } from "~/components/ui/button";
import { useCachedQuery } from "~/hooks/use-app-query";

const BrandRestaurantsPage = () => {
  const brandId = useParams().brandId as Id<"brands">;
  const { data: restaurants, isPending: restaurantsIsPending } = useCachedQuery(
    api.reataurants.functions.getBrandRestaurants,
    { brandId },
  );

  const [showCreateRestaurantPanel, setShowCreateRestaurantPanel] =
    useState<boolean>(false);

  return (
    <div className="brand-hub--page">
      <CreateRestaurantPanel
        open={showCreateRestaurantPanel}
        onOpenChange={setShowCreateRestaurantPanel}
      />
      {/* ~ =================================== ~ */}
      {/* -- Header  -- */}
      {/* ~ =================================== ~ */}
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-2xl font-semibold">Restaurants</h2>
        <div className="-mt-1 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            Manage your restaurants and their details.
          </span>

          {restaurants && restaurants.length > 0 && (
            <Button onClick={() => setShowCreateRestaurantPanel(true)}>
              <span> Add Restaurant</span>
            </Button>
          )}
        </div>
      </div>
      {/* ~ =================================== ~ */}
      {/* -- Loading State -- */}
      {/* ~ =================================== ~ */}
      {restaurantsIsPending && (
        <div className="mt-10 flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed">
          <div className="text-muted-foreground flex animate-pulse items-center gap-2">
            <IconChefHat size={20} strokeWidth={1.5} />
            <span>Loading...</span>
          </div>
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Empty state -- */}
      {/* ~ =================================== ~ */}
      {!restaurantsIsPending && restaurants && restaurants.length === 0 && (
        <div className="mt-10 flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed">
          <div className="text-muted-foreground flex w-full flex-col items-center gap-2">
            <span className="bg-muted/50 rounded-lg p-2">
              <IconBuildingStore size={25} strokeWidth={1.5} />
            </span>
            <span className="w-full max-w-2/3 text-center">
              No restaurants found. Create your first restaurant.
            </span>

            <Button
              className="mt-3 px-8"
              onClick={() => setShowCreateRestaurantPanel(true)}
            >
              <span>Add Restaurant</span>
            </Button>
          </div>
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Restaurant list -- */}
      {/* ~ =================================== ~ */}
    </div>
  );
};

export default BrandRestaurantsPage;
