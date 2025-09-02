import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type React from "react";
import {
  MenuCategoryDataTable,
  MenusCategoriesTableColumns,
} from "~/components/data-tables/menu-categories/category.datatable";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface CategoriesTabProps {
  restaurantId: Id<"restaurants">;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  restaurantId,
}) => {
  const { data: categories, isPending: categoriesIsPending } = useCachedQuery(
    api.features.menu_categories.functions.getByRestaurant,
    restaurantId ? { restaurant: restaurantId } : "skip"
  );
  return (
    <TabsContent value="categories">
      <div className="flex flex-col items-center">
        {categories && (
          <MenuCategoryDataTable
            columns={MenusCategoriesTableColumns}
            data={categories}
          />
        )}
      </div>
    </TabsContent>
  );
};
