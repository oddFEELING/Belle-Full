import SlicedText from "../custom-ui/sliced-text";
import { Button } from "../ui/button";
import {
  IconBuildingStore,
  IconPencilPlus,
  IconPlus,
} from "@tabler/icons-react";
import { Link } from "react-router";
import { UserBubble } from "../popovers/user.bubble.popover";
import { Authenticated } from "convex/react";
import { useUser } from "~/hooks/use-user/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";

const LandingNavbar = () => {
  const { user } = useUser();
  const { data: brands, isPending: brandsIsPending } = useCachedQuery(
    api.features.brands.functions.getUserBrands,
  );

  return (
    <div className="fixed top-0 right-0 left-0 flex h-max w-full items-center justify-between px-5 py-4 md:px-8 md:py-6 lg:px-12">
      <SlicedText
        text="BelleFull"
        className="hover:text-primary/90 cursor-pointer text-2xl font-semibold"
        containerClassName="w-max"
      />

      <div className="flex items-center gap-4">
        <Authenticated>
          {user?.hasBrand ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground group">
                  <IconBuildingStore size={16} strokeWidth={1.5} />
                  <span>My Brands</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {brands?.map((brand, idx: number) => (
                  <Link
                    to={`/brands/${brand?._id}/hub/restaurants`}
                    key={brand?._id ?? idx}
                  >
                    <DropdownMenuItem>
                      <span>{brand?.name}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <Link to="/brands/new/create">
                  <DropdownMenuItem>
                    <IconPlus />
                    <span>Create Brand</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/brands/new/create">
              <Button variant="ghost" className="text-muted-foreground group">
                <IconPencilPlus
                  strokeWidth={1.5}
                  className="translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                />
                <span>Add your restaurant</span>
              </Button>
            </Link>
          )}
        </Authenticated>

        <UserBubble />
      </div>
    </div>
  );
};

export default LandingNavbar;
