import { IconCamera } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useFileUpload } from "~/hooks/use-file-upload";
import { z } from "zod";
import { type Allergen } from "convex/enums";
import { type MenuItemOption } from "convex/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "~/lib/logger";
import { Form, FormField } from "~/components/ui/form";

const createMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.optional(z.string()),
  allergens: z.optional(z.array(z.custom<Allergen>())),
  mayContain: z.optional(z.array(z.custom<Allergen>())),
  calories: z.optional(z.number()),
  isAvailable: z.boolean(),
  options: z.array(z.custom<MenuItemOption>()),
});

type CreateMenuItemSchema = z.infer<typeof createMenuItemSchema>;

const AddMenuItem = () => {
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const brandId = useParams().brandId as Id<"brands">;
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const { data: menus } = useCachedQuery(
    api.menus.functions.getMenuByRestaurant,
    { restaurant: restaurantId },
  );

  // ~ ======= Form instance  ======= ~
  const form = useForm<CreateMenuItemSchema>({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      allergens: [],
      mayContain: [],
      calories: undefined,
      isAvailable: true,
      options: [],
    },
  });

  // ~ ======= Handle Submit  ======= ~
  const onSubmit = async (data: CreateMenuItemSchema) => {
    logger.info(data);
  };

  return (
    <div className="restaurant-dashboard--page">
      <div className="flex w-full items-center">
        <h2 className="text-xl font-semibold">Add a menu item</h2>
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Image upload -- */}
      {/* ~ =================================== ~ */}
      <div className="relative mt-4 inline-flex">
        <Button
          variant="outline"
          className="relative size-40 overflow-hidden rounded-xl p-0 shadow-none"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2"
            >
              <IconCamera
                size={30}
                strokeWidth={1.2}
                className="size-8 opacity-60"
              />
              <span className="text-muted-foreground text-sm font-medium">
                Upload image
              </span>
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Menu item details -- */}
      {/* ~ =================================== ~ */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4"></form>
      </Form>
    </div>
  );
};

export default AddMenuItem;
