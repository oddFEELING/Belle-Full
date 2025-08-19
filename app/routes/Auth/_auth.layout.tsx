import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";

const AuthLayout = () => {
  return (
    <div className="no-scroll-full-page bg-background grid grid-cols-2">
      {/* ~ =================================== ~ */}
      {/* -- Side Contetn -- */}
      {/* ~ =================================== ~ */}
      <aside className="hidden items-center justify-center p-5 lg:flex">
        <div className="bg-muted dark:bg-muted/40 flex h-full w-full flex-col justify-between rounded-3xl p-5">
          <Link to="/">
            <span className="cursor-pointer text-lg font-medium underline-offset-2 hover:underline">
              BelleFull
            </span>
          </Link>

          <div className="w-full max-w-lg">
            <p className="text-muted-foreground">
              African Cuisine, made simple
            </p>
            <p className="text-muted-foreground leading-tighter text-sm">
              Discover the best of African cuisine, enjoy the goodness without
              the hassle.
            </p>
          </div>
        </div>
      </aside>

      {/* ~ =================================== ~ */}
      {/* -- Main page content -- */}
      {/* ~ =================================== ~ */}
      <main className="col-span-2 lg:col-span-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
