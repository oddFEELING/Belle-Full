import {
  IconChevronDown,
  IconRobot,
  IconTrash,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { Chart } from "iconsax-reactjs";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tabs, TabsTrigger, TabsList } from "~/components/ui/tabs";
import { RestaurantAgentsOverviewTab } from "./partials/overview.tab";
import { useParams } from "react-router";
import type { Doc, Id } from "convex/_generated/dataModel";
import { RestaurantAgentsTab } from "./partials/agents.tab";
import { RestaurantAgentsEnquiriesTab } from "./partials/enquiries.tab";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const RestaurantAgents = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const [activeTab, setActiveTab] = useQueryState(
    "activeTab",
    parseAsString.withDefault("overview"),
  );

  // ~ ======= Queries ======= ~
  const { data: enquiries, isPending: enquiriesIsPending } = useCachedQuery(
    api.features.agent_enquiries.functions.getAgentEnquiriesByRestaurant,
    { restaurant: restaurantId },
  );

  const hasEnquiries =
    enquiries?.filter(
      (enquiry: Doc<"agent_enquiries">) => enquiry.status === "PENDING",
    ).length > 0;

  return (
    <div className="restaurant-dashboard--page">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Agents</h2>
          <p className="text-muted-foreground max-w-2xl">
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
          <DropdownMenuContent align="end" side="bottom" className="w-48">
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
          <TabsList className="bg-muted h-max w-full">
            <TabsTrigger
              value="overview"
              className="dark:data-[state=active]:bg-accent"
            >
              <Chart
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60 mr-1"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Overview
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="agents"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconRobot
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60 mr-1"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Agents
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="enquiries"
              className={cn(hasEnquiries && "border-primary/40 animate-pulse")}
            >
              <IconBrandWhatsapp size={16} strokeWidth={1.5} />
              <span className="dark:text-foreground/60 hidden sm:block">
                Enquiries
              </span>
              {hasEnquiries && (
                <span className="bg-primary ml-2 h-2 w-2 animate-pulse rounded-full" />
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
