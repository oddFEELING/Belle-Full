import type { AgentEnquiries, RestaurantAgents } from "db.types";

export interface AgentEnquiriesDatatableDto extends AgentEnquiries {
  _id: string;
  _creationTime: number;
  agent: RestaurantAgents | null;
}
