import React from "react";
import SlicedText from "../custom-ui/sliced-text";
import { Button } from "../ui/button";
import { IconBuildingStore, IconPencilPlus } from "@tabler/icons-react";
import { Link } from "react-router";

const LandingNavbar = () => {
  return (
    <div className="fixed top-0 right-0 left-0 flex h-max w-full items-center justify-between px-5 py-3 md:px-8 lg:px-10">
      <SlicedText
        text="BelleFull"
        className="hover:text-primary/90 cursor-pointer text-2xl font-semibold"
        containerClassName="w-max"
      />

      <div className="flex items-center gap-2">
        <Link to="/brands/create">
          <Button variant="ghost" className="text-muted-foreground group">
            <IconPencilPlus
              strokeWidth={1.5}
              className="translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            />
            <span>Add your restaurant</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingNavbar;
