import { components } from "../../_generated/api";
import type { DataModel, Id } from "../../_generated/dataModel";
import { mutation as rawMutation } from "../../_generated/server";
import { TableAggregate } from "@convex-dev/aggregate";

export const RestaurantMenuAnalytics = new TableAggregate<{
  Key: [string, string];
  DataModel: DataModel;
  TableName: "menus";
}>(components.aggregate, {
  sortKey: (doc) => [doc.restaurant, doc.brand],
});
