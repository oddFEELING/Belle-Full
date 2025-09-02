import {
  IconBrandWhatsapp,
  IconChevronDown,
  IconRobot,
  IconTrash,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { Chart } from "iconsax-reactjs";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";
import { cn } from "~/lib/utils";
import { RestaurantAgentsTab } from "./partials/agents.tab";
import { RestaurantAgentsEnquiriesTab } from "./partials/enquiries.tab";
import { RestaurantAgentsOverviewTab } from "./partials/overview.tab";

const RestaurantAgents = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const [activeTab, setActiveTab] = useQueryState(
    "activeTab",
    parseAsString.withDefault("overview")
  );

  // ~ ======= Queries ======= ~
  const { data: enquiries, isPending: enquiriesIsPending } = useCachedQuery(
    api.features.agent_enquiries.functions.getAgentEnquiriesByRestaurant,
    { restaurant: restaurantId }
  );

  const hasEnquiries =
    enquiries?.filter(
      (enquiry: Doc<"agent_enquiries">) => enquiry.status === "PENDING"
    ).length > 0;

  return (
    <div className="restaurant-dashboard--page">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Agents</h2>
          <p className="max-w-2xl text-muted-foreground">
            Manage the agents for your restaurant. Create, edit, and organize
            your agents.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <span>Actions</span>
              <IconChevronDown size={16} strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" side="bottom">
            <DropdownMenuItem>
              <IconRobot size={18} strokeWidth={1.5} />
              <span>Create Agent</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <IconTrash size={18} strokeWidth={1.5} />
              <span>Deactivate All</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Page tabs  -- */}
      {/* ~ =================================== ~ */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="mt-2 mb-3 w-full max-w-md">
          <TabsList className="h-max w-full bg-muted">
            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="overview"
            >
              <Chart
                className="mr-1 dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Overview
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="agents"
            >
              <IconRobot
                className="mr-1 dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Agents
              </span>
            </TabsTrigger>

            <TabsTrigger
              className={cn(hasEnquiries && "animate-pulse border-primary/40")}
              value="enquiries"
            >
              <IconBrandWhatsapp size={16} strokeWidth={1.5} />
              <span className="hidden sm:block dark:text-foreground/60">
                Enquiries
              </span>
              {hasEnquiries && (
                <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <RestaurantAgentsOverviewTab restaurantId={restaurantId} />
        <RestaurantAgentsTab restaurantId={restaurantId} />
        <RestaurantAgentsEnquiriesTab restaurantId={restaurantId} />
      </Tabs>
    </div>
  );
};

export default RestaurantAgents;
