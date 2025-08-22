import { useMutation } from "convex/react";
import type { PanelProps } from "./panel.types";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { logger } from "~/lib/logger";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Panel,
  PanelActionButton,
  PanelCancelButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../ui/panel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect } from "react";

interface CreateMenuCategoryPanelProps extends PanelProps {
  restaurant: Id<"restaurants">;
  brand: Id<"brands">;
}

const createMenuCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  restaurant: z.custom<Id<"restaurants">>(),
  brand: z.custom<Id<"brands">>(),
});

type CreateMenuCategorySchema = z.infer<typeof createMenuCategorySchema>;

const CreateMenuCategoryPanel: React.FC<CreateMenuCategoryPanelProps> = ({
  restaurant,
  brand,
  open,
  onOpenChange,
}) => {
  const createCategory = useMutation(api.menus.categories.functions.create);

  // ~ ======= Form instance ======= ~
  const form = useForm<CreateMenuCategorySchema>({
    resolver: zodResolver(createMenuCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      restaurant,
      brand,
    },
  });

  // ~ ======= Handle submit ======= ~
  const onSubmit = async (data: CreateMenuCategorySchema) => {
    await createCategory(data);
    onOpenChange(false);
  };

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Panel open={open} onOpenChange={onOpenChange}>
      <PanelContent className="[&>button]:hidden">
        <PanelHeader>
          <PanelTitle>Create Category</PanelTitle>
        </PanelHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 grid space-y-5 px-4 md:px-0"
          >
            {/* ~ ======= Name field ======= ~ */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Desciption field ======= ~ */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-28 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PanelFooter>
              <PanelCancelButton onClick={() => onOpenChange(false)}>
                Cancel
              </PanelCancelButton>
              <PanelActionButton type="submit">Create</PanelActionButton>
            </PanelFooter>
          </form>
        </Form>
      </PanelContent>
    </Panel>
  );
};

export { CreateMenuCategoryPanel };
