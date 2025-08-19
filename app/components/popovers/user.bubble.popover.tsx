import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Authenticated, Unauthenticated } from "convex/react";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useUser } from "~/hooks/use-user/use-user";
import { IconUser } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";

type UserBubbleProps = {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
};

const UserBubble = ({
  side = "bottom",
  align = "end",
  className,
}: UserBubbleProps) => {
  const { user, session, isLoading } = useUser();
  const navigate = useNavigate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar
          className="ring-muted-foreground/50 cursor-pointer transition-all duration-200 ease-out hover:ring"
          onClick={(event) => {
            if (user?.isAnonymous) {
              event.stopPropagation();
              navigate("/register");
            }
          }}
        >
          <AvatarImage src={user?.image}></AvatarImage>
          <AvatarFallback>
            <IconUser size={16} strokeWidth={1.5} />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      {/* ~ ======= Anonymous user ======= ~ */}
      {!user?.isAnonymous && (
        <PopoverContent
          align={align}
          side={side}
          className={cn("w-48", className)}
        ></PopoverContent>
      )}
    </Popover>
  );
};

export { UserBubble };
