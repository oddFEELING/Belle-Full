import {
  type Icon,
  IconBasketCheck,
  IconBuildingStore,
  IconChefHat,
  IconMapPinBolt,
  IconSearch,
  IconSend,
  IconSparkles,
} from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import posthog from "posthog-js";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "~/components/custom-ui/ai-chat.composer";
import LandingNavbar from "~/components/navigation/landing.navbar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BelleFull" },
    { name: "description", content: "African cuisine made simple." },
  ];
}

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <div className="no-scroll-full-page flex items-center justify-center bg-background px-5">
      <LandingNavbar />
      <div className="flex w-full max-w-2xl flex-col items-center justify-center">
        <h1 className="font-medium text-2xl md:text-3xl">
          Best African Cuisines with{" "}
          <span className="text-primary">BelleFull</span>
        </h1>

        <PromptInput className="mt-10 w-full bg-transparent">
          <PromptInputTextarea
            className="bg-transparent"
            placeholder="What do you want to eat today?"
          />
          <PromptInputActions className="items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {/* ~ ======= Popular restaurants ======= ~ */}
              <PromptInputAction tooltip="Popular meals">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="rounded-full text-muted-foreground hover:bg-muted/50"
                      variant="ghost"
                    >
                      <IconChefHat
                        className="text-muted-foreground"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <span>Popular</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="bottom">
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
                      className="rounded-full text-muted-foreground hover:bg-muted/50"
                      variant="ghost"
                    >
                      <IconSparkles
                        className="text-muted-foreground"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <span>featured</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="bottom">
                    <DropdownMenuItem>Manjaros</DropdownMenuItem>
                    <DropdownMenuItem>Babul's</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </PromptInputAction>
            </div>

            <PromptInputAction tooltip="Send">
              <Button
                className="rounded-full"
                size="icon"
                variant={isMobile ? "ghost" : "default"}
              >
                <IconSend />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        <div className="mt-10 grid w-full grid-cols-3 gap-4">
          {buttonActions.map((action) => (
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-muted-foreground transition-all duration-300 ease-out hover:border-primary/40 hover:font-medium hover:text-primary"
              key={action.text}
              onClick={action.action}
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
