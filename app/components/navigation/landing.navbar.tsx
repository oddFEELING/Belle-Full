import {
  IconBuildingStore,
  IconPencilPlus,
  IconPlus,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { Authenticated } from "convex/react";
import { Link } from "react-router";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useUser } from "~/hooks/use-user/use-user";
import SlicedText from "../custom-ui/sliced-text";
import { UserBubble } from "../popovers/user.bubble.popover";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LandingNavbar = () => {
  const { user } = useUser();
  const { data: brands } = useCachedQuery(
    api.features.brands.functions.getUserBrands
  );

  return (
    <div className="fixed top-0 right-0 left-0 flex h-max w-full items-center justify-between px-5 py-4 md:px-8 md:py-6 lg:px-12">
      <SlicedText
        className="cursor-pointer font-semibold text-2xl hover:text-primary/90"
        containerClassName="w-max"
        text="BelleFull"
      />

      <div className="flex items-center gap-4">
        <Authenticated>
          {user?.hasBrand ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="group text-muted-foreground" variant="ghost">
                  <IconBuildingStore size={16} strokeWidth={1.5} />
                  <span>My Brands</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {brands?.map((brand, idx: number) => (
                  <Link
                    key={brand?._id ?? idx}
                    to={`/brands/${brand?._id}/hub/restaurants`}
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
              <Button className="group text-muted-foreground" variant="ghost">
                <IconPencilPlus
                  className="translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={1.5}
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
