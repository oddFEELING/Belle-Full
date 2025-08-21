import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React, { useState } from "react";
import { useParams } from "react-router";
import UploadFileComponent from "~/components/comp-549";
import {
  RestaurantDocumentDataTable,
  RestaurantDocumentTableColumns,
} from "~/components/data-tables/restaurant-documents/restaurant.documents.datatable";
import UploadRestaurantDocumentsPanel from "~/components/panels/upload.restaurant.documents.panel";
import { Button } from "~/components/ui/button";
import { useCachedQuery } from "~/hooks/use-app-query";

const RestaurantLegalDocumentsPage = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const { data: documents } = useCachedQuery(
    api.restaurants.documents.listDocuments,
    restaurantId ? { restaurant: { id: restaurantId } } : "skip",
  );
  const [openUploadPanel, setOpenUploadPanel] = useState<boolean>(false);

  return (
    <div className="restaurant-dashboard--page">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Restaurant Documents </h2>
        <p className="text-muted-foreground max-w-2xl">
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
