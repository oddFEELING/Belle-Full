import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconLogout2, IconSettings, IconUser } from "@tabler/icons-react";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { useUser } from "~/hooks/use-user/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { Like1 } from "iconsax-reactjs";

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
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className="ring-muted-foreground/50 cursor-pointer transition-all duration-200 ease-out hover:ring"
          onClick={(event) => {
            if (!isAuthenticated) {
              event.stopPropagation();
              navigate("/register");
            }
          }}
        >
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            <IconUser size={16} strokeWidth={1.5} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {isAuthenticated && (
        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("w-56", className)}
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {user?.name || "User"}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <IconSettings size={16} />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Like1 size={16} />
            <span>Feedback</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => signOut()} variant="destructive">
            <IconLogout2 size={16} />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export { UserBubble };
