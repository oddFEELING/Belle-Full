import { zodResolver } from "@hookform/resolvers/zod";
import { IconClipboardText } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
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
  const createMenu = useMutation(api.features.menus.functions.create);

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
    <Panel onOpenChange={onOpenChange} open={open}>
      <PanelContent className="px-4 [&>button]:hidden">
        <PanelHeader>
          <PanelTitle className="flex items-center gap-1">
            <IconClipboardText size={20} stroke={1.3} />
            <span> Create Menu</span>
          </PanelTitle>
        </PanelHeader>
        <Form {...form}>
          <form
            className="mt-5 grid gap-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
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
                      className="h-28 resize-none"
                      placeholder="Enter a description for your menu"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <PanelFooter>
              <PanelCancelButton onClick={() => onOpenChange(false)}>
                Cancel
              </PanelCancelButton>
              <PanelActionButton type="submit">Create Menu</PanelActionButton>
            </PanelFooter>
          </form>
        </Form>
      </PanelContent>
    </Panel>
  );
};

export default CreateMenuPanel;
