import { Outlet } from "react-router";
import { useAnonUserCheck } from "~/hooks/use-anon-user-check";

const RootLayout = () => {
  useAnonUserCheck();

  return (
    <div className="bg-background h-[100dvh] w-full overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;
