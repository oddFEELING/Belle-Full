import { Outlet } from "react-router";
import { useAnonUserCheck } from "~/hooks/use-anon-user-check";

const RootLayout = () => {
  useAnonUserCheck();

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
