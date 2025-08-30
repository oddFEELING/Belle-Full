import React, { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Link, useLocation } from "react-router";
import { useParams } from "react-router";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { IconPoint } from "@tabler/icons-react";

const MAX_LENGTH = 3;

export const RestaurantHubBreadcrumb = () => {
  const pathname = useLocation().pathname;
  const fullPath = pathname.split("/").filter(Boolean);
  const sections = fullPath.slice(4);
  const { agentId } = useParams();
  const [activeTab] = useQueryState("activeTab");

  // ~ ======= Queries ======= ~
  const { data: agent } = useCachedQuery(
    api.features.agents.functions.getSingleAgent,
    agentId ? { agent: agentId as Id<"restaurant_agents"> } : "skip",
  );

  const replacements = useMemo(
    () => [[agent?._id, agent?.name]],
    [agent?.name],
  );

  const checkReplacement = (key: string) => {
    return replacements.filter((value) => value[0] === key)[0]?.[1] || key;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {sections.map((section: string, idx: number) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem className="text-xs">
              {idx !== sections.length - 1 ? (
                <BreadcrumbLink>
                  <Link to={`/${fullPath.slice(0, idx + 5).join("/")}`}>
                    {checkReplacement(section)}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="cursor-default">
                  {checkReplacement(section)}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx !== sections.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}

        {activeTab && (
          <div className="text-muted-foreground/60 flex cursor-default items-center gap-1 text-xs">
            <IconPoint size={12} strokeWidth={1.5} />
            <span>{activeTab}</span>
          </div>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
