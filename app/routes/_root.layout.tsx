import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background">
      <Outlet />
    </div>
  );
};

export default RootLayout;
