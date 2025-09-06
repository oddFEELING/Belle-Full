import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Panel,
  PanelActionButton,
  PanelCancelButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../ui/panel";
import { Textarea } from "../ui/textarea";
import type { PanelContentProps } from "./panel.types";

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
  const createRestaurant = useMutation(
    api.features.restaurants.functions.create
  );

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
    <Panel onOpenChange={onOpenChange} open={open}>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>New Restaurant</PanelTitle>
        </PanelHeader>
        <div className="flex h-max w-full items-center justify-center px-4 pt-5 pb-5 sm:px-0 md:pb-0">
          <Form {...form}>
            <form
              className="grid w-full max-w-md gap-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* ~ ======= Name field ======= ~ */}
              <FormField
                control={form.control}
                name="name"
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
                control={form.control}
                name="description"
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
                  onClick={() => onOpenChange(false)}
                  type="button"
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
