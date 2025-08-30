import { IconCamera, IconChevronDown, IconSettings } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  Package2Icon,
  LeafIcon,
  BanknoteIcon,
  SaveIcon,
  ArrowLeftIcon,
  PlusIcon,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useFileUpload } from "~/hooks/use-file-upload";
import { z } from "zod";
import {
  AllergenEnum,
  DietaryTagEnum,
  type Allergen,
  type DietaryTag,
} from "convex/types/enums";
import { Money, type MenuItemOption } from "convex/types/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "~/lib/logger";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { ValueMultiSelector } from "~/components/custom-ui/value-multi-select";
import { NumberField, Input as AriaInput, Group } from "react-aria-components";
import { cn } from "~/lib/utils";
import { useMemo, useState } from "react";
import { CreateMenuItemOptionPanel } from "~/components/panels/create.menu.item.option.panel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation } from "convex/react";

const createMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.optional(z.string()),
  allergens: z.array(z.custom<Allergen>()),
  mayContain: z.array(z.custom<Allergen>()),
  dietaryTags: z.array(z.custom<DietaryTag>()),
  calories: z.optional(z.number()),
  isAvailable: z.boolean(),
  basePrice: z.custom<Money>(),
  promotionalPrice: z.custom<Money>(),
});

type CreateMenuItemSchema = z.infer<typeof createMenuItemSchema>;

const AddMenuItem = () => {
  const navigate = useNavigate();
  const brandId = useParams().brandId as Id<"brands">;
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const uploadImage = useUploadFile(api.features.menu_items.media);
  const createMenuItem = useMutation(api.features.menu_items.functions.create);
  const [isLoading, setIsLoading] = useState(false);

  const [menuItemOptions, setMenuItemOptions] = useState<MenuItemOption[]>([]);
  const [showCreateMenuItemOptionPanel, setShowCreateMenuItemOptionPanel] =
    useState(false);
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const { data: menus } = useCachedQuery(
    api.features.menus.functions.getMenuByRestaurant,
    { restaurant: restaurantId },
  );

  // Build select options once for value-based multi selectors
  const dietaryOptions = useMemo(
    () =>
      Object.entries(DietaryTagEnum).map(([label, value]) => ({
        label,
        value,
      })),
    [],
  );
  const allergenOptions = useMemo(
    () =>
      Object.entries(AllergenEnum).map(([label, value]) => ({
        label,
        value,
      })),
    [],
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
      dietaryTags: [],
      calories: undefined,
      isAvailable: true,
      basePrice: {
        currency: "GBP",
        amount: 0,
      },
      promotionalPrice: {
        currency: "GBP",
        amount: 0,
      },
    },
  });

  // ~ ======= Handle Submit  ======= ~
  const onSubmit = async (data: CreateMenuItemSchema) => {
    setIsLoading(true);

    // Process menu item options to extract values from picks
    const processedOptions = menuItemOptions.map((option) => ({
      ...option,
      picks: option.picks.map((pick) => ({
        ...pick,
        dietaryTags: (pick.dietaryTags || []).map((t: any) =>
          typeof t === "string" ? t : t.value,
        ),
        allergens: (pick.allergens || []).map((a: any) =>
          typeof a === "string" ? a : a.value,
        ),
      })),
    }));

    const processedData = {
      ...data,
      dietaryTags: data.dietaryTags,
      allergens: data.allergens,
      mayContain: data.mayContain,
    };

    logger.info({
      data: { iamge: files[0], ...processedData, options: processedOptions },
    });
    let image: string | null = null;
    // ~ ======= If there is an image upload image first  ======= ~
    if (files[0]) {
      image = await uploadImage(files[0].file as File);
    }
    const menuItem = await createMenuItem({
      restaurant: restaurantId,
      brand: brandId,
      ...processedData,
      image: image || undefined,
      options: processedOptions,
    });

    console.log({ menuItem });
    setIsLoading(false);
  };

  return (
    <div className="restaurant-dashboard--page">
      <div className="container">
        <h3 className="text-2xl font-semibold">
          {form.watch("name") ? (
            <span className="text-foreground">{form.watch("name")}</span>
          ) : (
            <span className="text-muted-foreground">Add menu item</span>
          )}
        </h3>
      </div>
      {/* ~ =================================== ~ */}
      {/* -- Main content -- */}
      {/* ~ =================================== ~ */}
      <div className="container max-w-4xl py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* ~ =================================== ~ */}
            {/* -- Basic details -- */}
            {/* ~ =================================== ~ */}
            <div className="bg-muted/40 dark:bg-muted space-y-6 rounded-2xl p-4 md:p-8">
              <div className="flex items-center gap-3">
                <div className="bg-background rounded-lg p-2">
                  <Package2Icon
                    size={20}
                    strokeWidth={1.2}
                    className="text-primary h-5 w-5"
                  />
                </div>
                <div>
                  <h3 className="text-primary text-lg font-semibold">
                    Basic Details
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Essential information about your menu item
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 md:flex-row">
                {/* ~ ======= Image upload ======= ~ */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "hover:border-primary/50 relative h-32 w-32 overflow-hidden rounded-xl border-2 border-dashed p-0 transition-all",
                        previewUrl && "border-solid border-transparent",
                      )}
                      onClick={openFileDialog}
                      aria-label={previewUrl ? "Change image" : "Upload image"}
                    >
                      {previewUrl ? (
                        <img
                          className="size-full object-cover"
                          src={previewUrl}
                          alt="Preview of uploaded image"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 p-4">
                          <IconCamera
                            size={20}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                          <span className="text-muted-foreground text-center text-xs">
                            Add image
                          </span>
                        </div>
                      )}
                    </Button>
                    {previewUrl && (
                      <Button
                        type="button"
                        onClick={() => removeFile(files[0]?.id)}
                        size="icon"
                        variant="secondary"
                        className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full shadow-sm"
                        aria-label="Remove image"
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    )}
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload image file"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="grid flex-1 gap-6 md:grid-cols-2">
                  {/* ~ ======= Name field ======= ~ */}
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Item Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Classic Cheeseburger"
                            className="focus:ring-primary/20 h-10 rounded-lg transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ~ ======= Availability field ======= ~ */}
                  <FormField
                    name="isAvailable"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Availability
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? "true" : "false"}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <SelectTrigger className="focus:ring-primary/20 h-10 rounded-lg transition-all focus:ring-2">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">
                                <span className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                  Available now
                                </span>
                              </SelectItem>
                              <SelectItem value="false">
                                <span className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                  Not available
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="focus:ring-primary/20 min-h-[120px] resize-none rounded-lg transition-all focus:ring-2"
                            placeholder="Describe your menu item in detail..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* ~ =================================== ~ */}
            {/* -- Dietary information section -- */}
            {/* ~ =================================== ~ */}
            <div className="bg-muted/40 dark:bg-muted space-y-6 rounded-2xl p-4 md:p-8">
              <div className="flex items-center gap-3">
                <div className="bg-background rounded-lg p-2">
                  <LeafIcon
                    size={20}
                    strokeWidth={1.2}
                    className="text-primary h-5 w-5"
                  />
                </div>
                <div>
                  <h3 className="text-primary text-lg font-semibold">
                    Dietary Information
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Help customers make informed choices
                  </p>
                </div>
              </div>

              <div className="grid gap-y-8 md:grid-cols-2 md:gap-6">
                {/* ~ ======= Calories field ======= ~ */}
                <FormField
                  name="calories"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-sm font-medium">
                        Calorie Content
                        <span className="text-muted-foreground ml-2 text-xs font-normal">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            type="number"
                            placeholder="e.g. 450"
                            className="focus:ring-primary/20 h-10 rounded-lg pr-16 transition-all focus:ring-2"
                          />
                          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                            kcal
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= DietaryTags field ======= ~ */}
                <FormField
                  name="dietaryTags"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Dietary Tags
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          options={dietaryOptions}
                          className="w-full"
                          placeholder=" -> Dietary tags"
                          triggerClassName="min-h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Allergens field ======= ~ */}
                <FormField
                  name="allergens"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Contains Allergens
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          options={allergenOptions}
                          className="w-full"
                          placeholder="-> Allergens in item..."
                          triggerClassName="min-h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= May contain field ======= ~ */}
                <FormField
                  name="mayContain"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        May Contain Traces
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          options={allergenOptions}
                          className="w-full"
                          placeholder="-> May contain..."
                          triggerClassName="min-h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ~ =================================== ~ */}
            {/* -- Options -- */}
            {/* ~ =================================== ~ */}
            <div className="bg-muted/40 dark:bg-muted space-y-6 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-background rounded-lg p-2">
                  <IconSettings
                    size={20}
                    strokeWidth={1.2}
                    className="text-primary h-5 w-5"
                  />
                </div>
                <div>
                  <h3 className="text-primary text-lg font-semibold">
                    Options
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Customize your menu item with options
                  </p>
                </div>
              </div>

              {/* ~ ======= Options list ======= ~ */}
              <div className="flex flex-col gap-3">
                {menuItemOptions.map((option: MenuItemOption) => {
                  return (
                    <Collapsible
                      key={option.position}
                      className="group border-border/50 bg-card hover:border-border rounded-lg border transition-all hover:shadow-sm"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-between gap-4 p-4">
                          <div className="flex items-center gap-3">
                            <Package2Icon className="text-muted-foreground h-4 w-4" />
                            <div>
                              <h4 className="text-sm font-medium">
                                {option.name}
                              </h4>
                              <p className="text-muted-foreground text-xs">
                                {option.picks.length} option
                                {option.picks.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <ChevronDownIcon className="text-muted-foreground h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-border/30 border-t p-4 pt-3">
                          {option.description && (
                            <p className="text-muted-foreground mb-3 text-sm">
                              {option.description}
                            </p>
                          )}
                          <div className="space-y-2">
                            {option.picks.map((pick) => (
                              <div
                                key={pick.name}
                                className="bg-muted/30 space-y-2 rounded-md p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {pick.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <BanknoteIcon className="text-muted-foreground h-3 w-3" />
                                    <span className="text-sm font-medium">
                                      {pick.price.currency === "GBP"
                                        ? "£"
                                        : pick.price.currency === "USD"
                                          ? "$"
                                          : pick.price.currency === "NGN"
                                            ? "₦"
                                            : pick.price.currency}
                                      {pick.price.amount.toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                {/* Additional pick details */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  {pick.calories && (
                                    <div className="bg-background/50 flex items-center gap-1 rounded px-2 py-1">
                                      <span className="text-muted-foreground">
                                        🔥
                                      </span>
                                      <span>{pick.calories} cal</span>
                                    </div>
                                  )}

                                  {pick.dietaryTags &&
                                    pick.dietaryTags.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        {pick.dietaryTags.map((tag) => (
                                          <div
                                            key={String(tag)}
                                            className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-green-700"
                                          >
                                            <LeafIcon className="h-3 w-3" />
                                            <span className="capitalize">
                                              {String(tag)
                                                .toLowerCase()
                                                .replace(/_/g, " ")}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                  {pick.allergens &&
                                    pick.allergens.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        {pick.allergens.map((allergen) => (
                                          <div
                                            key={String(allergen)}
                                            className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-amber-700"
                                          >
                                            <span>⚠️</span>
                                            <span className="capitalize">
                                              {String(allergen)
                                                .toLowerCase()
                                                .replace(/_/g, " ")}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setShowCreateMenuItemOptionPanel(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add option
                </Button>
                <CreateMenuItemOptionPanel
                  open={showCreateMenuItemOptionPanel}
                  onOpenChange={setShowCreateMenuItemOptionPanel}
                  setFormState={setMenuItemOptions}
                />
              </div>
            </div>

            {/* ~ =================================== ~ */}
            {/* -- Pricing section -- */}
            {/* ~ =================================== ~ */}
            <div className="bg-muted/40 dark:bg-muted space-y-6 rounded-2xl p-4 md:p-8">
              <div className="flex items-center gap-3">
                <div className="bg-background rounded-lg p-2">
                  <BanknoteIcon
                    size={20}
                    strokeWidth={1.2}
                    className="text-primary h-5 w-5"
                  />
                </div>
                <div>
                  <h3 className="text-primary text-lg font-semibold">
                    Pricing
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Set your item pricing and promotions
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* ~ ======= Base price field ======= ~ */}
                <FormField
                  name="basePrice"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Base Price
                      </FormLabel>
                      <FormControl>
                        <NumberField
                          defaultValue={field.value.amount}
                          formatOptions={{
                            style: "currency",
                            currency: field.value.currency,
                            currencySign: "standard",
                          }}
                          onChange={(value) =>
                            field.onChange({ ...field.value, amount: value })
                          }
                          aria-label="Base Price"
                        >
                          <Group className="border-input bg-background focus-within:ring-primary/20 relative flex h-10 w-full items-center overflow-hidden rounded-lg border text-sm shadow-xs transition-all focus-within:ring-2">
                            <AriaInput className="dark:bg-input/30 flex-1 bg-transparent px-3 py-2 tabular-nums outline-none" />
                            <div className="border-input flex h-full flex-col border-l">
                              <Button
                                slot="increment"
                                type="button"
                                className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-1/2 w-8 items-center justify-center border-b transition-colors"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                slot="decrement"
                                type="button"
                                className="bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-1/2 w-8 items-center justify-center transition-colors"
                              >
                                <ChevronDownIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </Group>
                        </NumberField>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Promotional price field ======= ~ */}
                <FormField
                  name="promotionalPrice"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Promotional Price
                        <span className="text-muted-foreground ml-2 text-xs font-normal">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <NumberField
                          defaultValue={field.value.amount}
                          formatOptions={{
                            style: "currency",
                            currency: field.value.currency,
                            currencySign: "standard",
                          }}
                          onChange={(value) =>
                            field.onChange({ ...field.value, amount: value })
                          }
                          aria-label="Discount Price"
                        >
                          <Group className="border-input bg-background focus-within:ring-primary/20 relative flex h-10 w-full items-center overflow-hidden rounded-lg border text-sm shadow-xs transition-all focus-within:ring-2">
                            <AriaInput className="dark:bg-input/30 flex-1 bg-transparent px-3 py-2 tabular-nums outline-none" />
                            <div className="border-input flex h-full flex-col border-l">
                              <Button
                                slot="increment"
                                type="button"
                                className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-1/2 w-8 items-center justify-center border-b transition-colors"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                slot="decrement"
                                type="button"
                                className="bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-1/2 w-8 items-center justify-center transition-colors"
                              >
                                <ChevronDownIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </Group>
                        </NumberField>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Action bar -- */}
      {/* ~ =================================== ~ */}
      <div className="z-20 border-t">
        <div className="container flex h-16 items-center justify-end gap-3 px-4 md:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            className="min-w-[100px] gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Item"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;
