import {
  IconClipboardText,
  IconPennant,
  IconSoup,
  IconSquareRoundedPercentage,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface OverviewTabProps {
  restaurantId: Id<"restaurants">;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ restaurantId }) => {
  const { data: menuAnalytics, isPending: menuAnalyticsIsPending } =
    useCachedQuery(api.features.menus.functions.menuAnalytics, {
      restaurant: restaurantId,
    });

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Menus</CardTitle>
            <IconClipboardText
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {menuAnalytics?.menuCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Total menus in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Total Menu Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Menu Items</CardTitle>
            <IconSoup
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {menuAnalytics?.menuItemCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Total menu items in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Active Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Menus</CardTitle>
            <IconPennant
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">4</div>
            <p className="text-muted-foreground text-xs">
              Currently published menus
            </p>
          </CardContent>
        </Card>

        {/* Average Items per Menu Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Avg Items/Menu
            </CardTitle>
            <IconSquareRoundedPercentage
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">21</div>
            <p className="text-muted-foreground text-xs">
              Average items per menu
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
