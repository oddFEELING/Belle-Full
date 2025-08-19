import React from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import type { PanelContentProps, PanelProviderProps } from "./panel.typs";
import { useIsMobile } from "~/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logger } from "~/lib/logger";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// ~ =============================================>
// ~ ======= Panel provider
// ~ =============================================>
const CreateRestaurantPanelProvider: React.FC<PanelProviderProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>New Restaurant</DrawerTitle>
            <VisuallyHidden>
              <DrawerDescription></DrawerDescription>
            </VisuallyHidden>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Restaurant</DialogTitle>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// ~ =============================================>
// ~ ======= Form types
// ~ =============================================>
const createRestaurantSchema = z.object({
  name: z.string(),
});

type CreateRestaurantSchema = z.infer<typeof createRestaurantSchema>;

// ~ =============================================>
// ~ ======= Panel Content
// ~ =============================================>
const CreateRestaurantPanel: React.FC<PanelContentProps> = ({
  open,
  onOpenChange,
}) => {
  // ~ ======= Form instance ======= ~
  const form = useForm<CreateRestaurantSchema>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
    },
  });

  // ~ ======= Handle submit  ======= ~
  const onSubmit = async (data: CreateRestaurantSchema) => {
    logger.debug(data);
  };
  return (
    <CreateRestaurantPanelProvider open={open} onOpenChange={onOpenChange}>
      <div className="flex h-40 w-full items-center justify-center px-4 py-3 md:px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full max-w-md gap-y-3"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button>Create</Button>
          </form>
        </Form>
      </div>
    </CreateRestaurantPanelProvider>
  );
};

export { CreateRestaurantPanel };
