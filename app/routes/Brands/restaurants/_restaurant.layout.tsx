import React from "react";
import { Outlet } from "react-router";
import RestaurantSidebar from "~/components/navigation/restaurant.sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const RestaurantLayout = () => {
  return (
    <SidebarProvider>
      <RestaurantSidebar />
      <SidebarInset>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RestaurantLayout;
