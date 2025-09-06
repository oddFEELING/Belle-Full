import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useParams } from "react-router";
import {
  RestaurantDocumentDataTable,
  RestaurantDocumentTableColumns,
} from "~/components/data-tables/restaurant-documents/restaurant.documents.datatable";
import { useCachedQuery } from "~/hooks/use-app-query";

const RestaurantLegalDocumentsPage = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const { data: documents } = useCachedQuery(
    api.features.restaurants.documents.listDocuments,
    restaurantId ? { restaurant: { id: restaurantId } } : "skip"
  );

  return (
    <div className="restaurant-dashboard--page">
      <div className="mb-4">
        <h2 className="font-semibold text-2xl">Restaurant Documents </h2>
        <p className="max-w-2xl text-muted-foreground">
          Upload and manage the documents that are required for your restaurant.
        </p>
      </div>

      <section className="mt-10">
        {documents && (
          <RestaurantDocumentDataTable
            columns={RestaurantDocumentTableColumns}
            data={documents}
          />
        )}
      </section>
    </div>
  );
};

export default RestaurantLegalDocumentsPage;
