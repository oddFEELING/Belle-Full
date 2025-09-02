import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  AgentEnquiriesDataTable,
  AgentEnquiriesTableColumns,
} from "~/components/data-tables/agent-enquiries/agent.enquiries.datatable";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface RestaurantAgentsOverviewTabProps {
  restaurantId: Id<"restaurants">;
}

export const RestaurantAgentsEnquiriesTab: React.FC<
  RestaurantAgentsOverviewTabProps
> = ({ restaurantId }) => {
  const { data: enquiries, isPending: enquiriesIsPending } = useCachedQuery(
    api.features.agent_enquiries.functions.getAgentEnquiriesByRestaurant,
    { restaurant: restaurantId }
  );

  return (
    <TabsContent value="enquiries">
      {enquiries && (
        <AgentEnquiriesDataTable
          columns={AgentEnquiriesTableColumns}
          data={enquiries}
        />
      )}
    </TabsContent>
  );
};
