import { Authenticated, AuthLoading, useConvexAuth } from "convex/react";
import { Outlet, useNavigate } from "react-router";

const BrandLayout = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (!(isLoading || isAuthenticated)) {
    return navigate("/", { replace: true });
  }

  return (
    <>
      <AuthLoading>
        <div className="flex h-screen w-full items-center justify-center">
          <p> Loading...</p>
        </div>
      </AuthLoading>

      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
};

export default BrandLayout;
