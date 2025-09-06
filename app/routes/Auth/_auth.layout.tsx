import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="no-scroll-full-page grid grid-cols-2 bg-background">
      {/* ~ =================================== ~ */}
      {/* -- Side Contetn -- */}
      {/* ~ =================================== ~ */}
      <aside className="hidden items-center justify-center p-5 lg:flex">
        <div className="flex h-full w-full flex-col justify-between rounded-3xl bg-muted p-5 dark:bg-muted/40">
          <Link to="/">
            <span className="cursor-pointer font-medium text-lg underline-offset-2 hover:underline">
              BelleFull
            </span>
          </Link>

          <div className="w-full max-w-lg">
            <p className="text-muted-foreground">
              African Cuisine, made simple
            </p>
            <p className="text-muted-foreground text-sm leading-tighter">
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
