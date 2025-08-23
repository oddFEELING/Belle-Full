import React from "react";
import { Outlet } from "react-router";
import RestaurantNavbar from "~/components/navigation/restaurant.navbar";
import RestaurantSidebar from "~/components/navigation/restaurant.sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const RestaurantLayout = () => {
  return (
    <SidebarProvider>
      <RestaurantSidebar />
      <SidebarInset>
        <main className="h-[var(--panel-body-height)] w-full">
          <RestaurantNavbar />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RestaurantLayout;
