import React from "react";
import { z } from "zod";
import type { PanelContentProps } from "./panel.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useNavigate, useParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Textarea } from "../ui/textarea";
import {
  Panel,
  PanelActionButton,
  PanelCancelButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../ui/panel";

// ~ =============================================>
// ~ ======= Form types
// ~ =============================================>
const createRestaurantSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});
type CreateRestaurantSchema = z.infer<typeof createRestaurantSchema>;

// ~ =============================================>
// ~ ======= Panel Content
// ~ =============================================>
const CreateRestaurantPanel: React.FC<PanelContentProps> = ({
  open,
  onOpenChange,
}) => {
  const brandId = useParams().brandId as Id<"brands">;
  const navigate = useNavigate();
  const createRestaurant = useMutation(api.restaurants.functions.create);

  // ~ ======= Form instance ======= ~
  const form = useForm<CreateRestaurantSchema>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // ~ ======= Handle submit  ======= ~
  const onSubmit = async (data: CreateRestaurantSchema) => {
    const restaurantId = await createRestaurant({ brand: brandId, ...data });
    navigate(`/brands/${brandId}/restaurants/${restaurantId}`);
  };

  return (
    <Panel open={open} onOpenChange={onOpenChange}>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>New Restaurant</PanelTitle>
        </PanelHeader>
        <div className="flex h-max w-full items-center justify-center px-4 pt-5 pb-5 sm:px-0 md:pb-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full max-w-md gap-y-5"
            >
              {/* ~ ======= Name field ======= ~ */}
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

              {/* ~ ======= Description field ======= ~ */}
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="e.g. London branch" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PanelFooter>
                <PanelCancelButton
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </PanelCancelButton>
                <PanelActionButton type="submit">Create</PanelActionButton>
              </PanelFooter>
            </form>
          </Form>
        </div>
      </PanelContent>
    </Panel>
  );
};

export { CreateRestaurantPanel };
