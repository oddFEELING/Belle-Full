import React, { useState } from "react";
import UploadFileComponent from "~/components/comp-549";
import UploadRestaurantDocumentsPanel from "~/components/panels/upload.restaurant.documents.panel";
import { Button } from "~/components/ui/button";

const RestaurantLegalDocumentsPage = () => {
  const [openUploadPanel, setOpenUploadPanel] = useState<boolean>(false);

  return (
    <div className="restaurant-dashboard--page">
      <Button onClick={() => setOpenUploadPanel(true)}>
        <span>Upload Documents</span>
      </Button>
      <UploadRestaurantDocumentsPanel
        open={openUploadPanel}
        onOpenChange={setOpenUploadPanel}
      />
    </div>
  );
};

export default RestaurantLegalDocumentsPage;
