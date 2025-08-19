import { Outlet } from "react-router";
import BrandHubNavbar from "~/components/navigation/brand-hub.navbar";
import BrandHubSidebar from "~/components/navigation/brand-hub.sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const BrandHubLayout = () => {
  return (
    <SidebarProvider>
      <BrandHubSidebar />
      <SidebarInset>
        <main>
          <BrandHubNavbar />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BrandHubLayout;
