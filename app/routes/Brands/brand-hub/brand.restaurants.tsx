import { IconBuildingStore, IconLockBolt, IconPlus } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CreateRestaurantPanel } from "~/components/panels/create.restaurant.panel";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useIsMobile } from "~/hooks/use-mobile";

const SKELETON_COUNT = 6;

const BrandRestaurantsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const brandId = useParams().brandId as Id<"brands">;
  const { data: restaurants, isPending: restaurantsIsPending } = useCachedQuery(
    api.features.restaurants.functions.getBrandRestaurants,
    { brandId }
  );

  const [showCreateRestaurantPanel, setShowCreateRestaurantPanel] =
    useState<boolean>(false);

  return (
    <div className="brand-hub--page">
      {isMobile && (
        <Button
          className="fixed right-4 bottom-4 z-20"
          onClick={() => setShowCreateRestaurantPanel(true)}
          size="lg"
        >
          <IconPlus size={20} strokeWidth={2.5} />
        </Button>
      )}
      <CreateRestaurantPanel
        onOpenChange={setShowCreateRestaurantPanel}
        open={showCreateRestaurantPanel}
      />
      {/* ~ =================================== ~ */}
      {/* -- Header  -- */}
      {/* ~ =================================== ~ */}
      <div className="flex w-full flex-col gap-2">
        <h2 className="font-semibold text-2xl">Restaurants</h2>
        <div className="-mt-1 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            Manage your restaurants and their details.
          </span>

          {restaurants && restaurants.length > 0 && !isMobile && (
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
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {new Array(SKELETON_COUNT).fill(0).map((_, idk: number) => (
            <Skeleton
              className="h-20 w-full animate-pulse rounded-xl bg-muted-foreground/10"
              key={idk}
            />
          ))}
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Empty state -- */}
      {/* ~ =================================== ~ */}
      {!restaurantsIsPending && restaurants && restaurants.length === 0 && (
        <div className="mt-10 flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed">
          <div className="flex w-full flex-col items-center gap-2 text-muted-foreground">
            <span className="rounded-lg bg-muted/50 p-2">
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
      {restaurants && restaurants.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Card
              className="cursor-pointer justify-between ring-primary/40 transition-all duration-200 ease-out hover:ring-1"
              key={restaurant._id}
              onClick={() =>
                navigate(`/brands/${brandId}/restaurants/${restaurant._id}`)
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="line-clamp-1 font-semibold text-lg">
                    {restaurant.name}
                  </CardTitle>
                  <span className="text-muted-foreground text-xs">
                    {restaurant.status}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">
                  {restaurant?.description ?? "No description."}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                  <IconLockBolt
                    className="text-muted-foreground"
                    size={16}
                    strokeWidth={1.5}
                  />

                  <span className="cursor-pointer underline-offset-4 transition-all duration-100 ease-out hover:text-primary/70 hover:underline">
                    {restaurant.slug}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandRestaurantsPage;
