import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="bg-background h-[100dvh] w-full overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;
