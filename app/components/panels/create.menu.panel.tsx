import { z } from "zod";
import type { PanelContentProps } from "./panel.typs";
import {
  Panel,
  PanelHeader,
  PanelContent,
  PanelTitle,
  PanelFooter,
} from "../ui/panel";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "~/lib/logger";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IconClipboard, IconClipboardText } from "@tabler/icons-react";
import { useEffect } from "react";

interface CreateMenuProviderProps extends PanelContentProps {
  brand: Id<"brands">;
  restaurant: Id<"restaurants">;
}

const createMenuSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  brand: z.custom<Id<"brands">>(),
  restaurant: z.custom<Id<"restaurants">>(),
});
type CreateMenuSchema = z.infer<typeof createMenuSchema>;

const CreateMenuPanel: React.FC<CreateMenuProviderProps> = ({
  open,
  brand,
  restaurant,
  onOpenChange,
}) => {
  const createMenu = useMutation(api.menus.functions.create);

  // ~ ======= Form instance ======= ~
  const form = useForm<CreateMenuSchema>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      name: "",
      description: "",
      brand,
      restaurant,
    },
  });

  // ~ ======= Handle submit ======= ~
  const onSubmit = async (data: CreateMenuSchema) => {
    await createMenu(data);
    onOpenChange(false);
  };

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Panel open={open} onOpenChange={onOpenChange}>
      <PanelContent className="px-4 [&>button]:hidden">
        <PanelHeader>
          <PanelTitle className="flex items-center gap-1">
            <IconClipboardText size={20} stroke={1.3} />
            <span> Create Menu</span>
          </PanelTitle>
        </PanelHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 grid gap-y-5"
          >
            {/* ~ ======= Name ======= ~ */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ~ ======= Description ======= ~ */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      {...field}
                      placeholder="Enter a description for your menu"
                      className="h-28 resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <PanelFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Menu</Button>
            </PanelFooter>
          </form>
        </Form>
      </PanelContent>
    </Panel>
  );
};

export default CreateMenuPanel;
