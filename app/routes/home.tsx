import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "~/components/custom-ui/ai-chat.composer";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import {
  IconBasketCheck,
  IconBuildingStore,
  IconChefHat,
  IconMapPinBolt,
  IconSearch,
  IconSend,
  IconSparkles,
  type Icon,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import LandingNavbar from "~/components/navigation/landing.navbar";
import { useIsMobile } from "~/hooks/use-mobile";
import posthog from "posthog-js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BelleFull" },
    { name: "description", content: "African cuisine made simple." },
  ];
}

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div className="no-scroll-full-page bg-background flex items-center justify-center px-5">
      <LandingNavbar />
      <div className="flex w-full max-w-2xl flex-col items-center justify-center">
        <h1 className="text-2xl font-medium md:text-3xl">
          Best African Cuisines with{" "}
          <span className="text-primary">BelleFull</span>
        </h1>

        <PromptInput className="mt-10 w-full bg-transparent">
          <PromptInputTextarea
            placeholder="What do you want to eat today?"
            className="bg-transparent"
          />
          <PromptInputActions className="items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {/* ~ ======= Popular restaurants ======= ~ */}
              <PromptInputAction tooltip="Popular meals">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:bg-muted/50 rounded-full"
                    >
                      <IconChefHat
                        size={18}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                      <span>Popular</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem>Manjaros</DropdownMenuItem>
                    <DropdownMenuItem>Babul's</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </PromptInputAction>

              {/* ~ ======= Featured restaurants ======= ~ */}
              <PromptInputAction tooltip="Featured restaurants">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:bg-muted/50 rounded-full"
                    >
                      <IconSparkles
                        size={18}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                      <span>featured</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem>Manjaros</DropdownMenuItem>
                    <DropdownMenuItem>Babul's</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </PromptInputAction>
            </div>

            <PromptInputAction tooltip="Send">
              <Button
                variant={isMobile ? "ghost" : "default"}
                size="icon"
                className="rounded-full"
              >
                <IconSend />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        <div className="mt-10 grid w-full grid-cols-3 gap-4">
          {buttonActions.map((action) => (
            <div
              key={action.text}
              onClick={action.action}
              className="text-muted-foreground hover:border-primary/40 hover:text-primary flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-all duration-300 ease-out hover:font-medium"
            >
              <action.Icon size={20} strokeWidth={1.3} />
              <span className="text-sm">{action.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const buttonActions: {
  action: () => void;
  text: string;
  Icon: Icon | LucideIcon;
}[] = [
  {
    text: "Reorder",
    Icon: IconBasketCheck,
    action: () => {
      throw new Error("No orders found");
    },
  },
  {
    text: "Explore",
    Icon: IconBuildingStore,
    action: () => {
      posthog.captureException("Nothing to explore", {
        event: "Exploring page",
      });
    },
  },
  { text: "Near me", Icon: IconMapPinBolt, action: () => {} },
];
