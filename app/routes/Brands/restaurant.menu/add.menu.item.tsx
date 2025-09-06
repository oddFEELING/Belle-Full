import { useUploadFile } from "@convex-dev/r2/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCamera, IconSettings } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  type Allergen,
  AllergenEnum,
  type DietaryTag,
  DietaryTagEnum,
} from "convex/types/enums";
import type { MenuItemOption, Money } from "convex/types/shared";
import {
  BanknoteIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LeafIcon,
  Loader2,
  Package2Icon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Input as AriaInput, Group, NumberField } from "react-aria-components";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { ValueMultiSelector } from "~/components/custom-ui/value-multi-select";
import { CreateMenuItemOptionPanel } from "~/components/panels/create.menu.item.option.panel";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
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

import { useFileUpload } from "~/hooks/use-file-upload";
import { logger } from "~/lib/logger";
import { cn } from "~/lib/utils";

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  NGN: "₦",
};

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
  // const fileName = files[0]?.file.name || null;

  // const { data: menus } = useCachedQuery(
  //   api.features.menus.functions.getMenuByRestaurant,
  //   { restaurant: restaurantId }
  // );

  // Build select options once for value-based multi selectors
  const dietaryOptions = useMemo(
    () =>
      Object.entries(DietaryTagEnum).map(([label, value]) => ({
        label,
        value,
      })),
    []
  );
  const allergenOptions = useMemo(
    () =>
      Object.entries(AllergenEnum).map(([label, value]) => ({
        label,
        value,
      })),
    []
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
          typeof t === "string" ? t : t.value
        ),
        allergens: (pick.allergens || []).map((a: any) =>
          typeof a === "string" ? a : a.value
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

    logger.info({ menuItem });
    setIsLoading(false);
  };

  return (
    <div className="restaurant-dashboard--page">
      <div className="container">
        <h3 className="font-semibold text-2xl">
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
          <form className="space-y-12" onSubmit={form.handleSubmit(onSubmit)}>
            {/* ~ =================================== ~ */}
            {/* -- Basic details -- */}
            {/* ~ =================================== ~ */}
            <div className="space-y-6 rounded-2xl bg-muted/40 p-4 md:p-8 dark:bg-muted">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background p-2">
                  <Package2Icon
                    className="h-5 w-5 text-primary"
                    size={20}
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">
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
                      aria-label={previewUrl ? "Change image" : "Upload image"}
                      className={cn(
                        "relative h-32 w-32 overflow-hidden rounded-xl border-2 border-dashed p-0 transition-all hover:border-primary/50",
                        previewUrl && "border-transparent border-solid"
                      )}
                      onClick={openFileDialog}
                      type="button"
                      variant="outline"
                    >
                      {previewUrl ? (
                        <img
                          alt="upload-preview"
                          className="size-full object-cover"
                          height={128}
                          src={previewUrl}
                          width={128}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 p-4">
                          <IconCamera
                            className="text-muted-foreground"
                            size={20}
                            strokeWidth={1.5}
                          />
                          <span className="text-center text-muted-foreground text-xs">
                            Add image
                          </span>
                        </div>
                      )}
                    </Button>
                    {previewUrl && (
                      <Button
                        aria-label="Remove image"
                        className="-top-1.5 -right-1.5 absolute h-6 w-6 rounded-full shadow-sm"
                        onClick={() => removeFile(files[0]?.id)}
                        size="icon"
                        type="button"
                        variant="secondary"
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    )}
                    <input
                      {...getInputProps()}
                      aria-label="Upload image file"
                      className="sr-only"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="grid flex-1 gap-6 md:grid-cols-2">
                  {/* ~ ======= Name field ======= ~ */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Item Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Classic Cheeseburger"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ~ ======= Availability field ======= ~ */}
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Availability
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"}
                          >
                            <SelectTrigger className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-primary/20">
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
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-medium text-sm">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none rounded-lg transition-all focus:ring-2 focus:ring-primary/20"
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
            <div className="space-y-6 rounded-2xl bg-muted/40 p-4 md:p-8 dark:bg-muted">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background p-2">
                  <LeafIcon
                    className="h-5 w-5 text-primary"
                    size={20}
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">
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
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="font-medium text-sm">
                        Calorie Content
                        <span className="ml-2 font-normal text-muted-foreground text-xs">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="h-10 rounded-lg pr-16 transition-all focus:ring-2 focus:ring-primary/20"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="e.g. 450"
                            type="number"
                            value={field.value || ""}
                          />
                          <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
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
                  control={form.control}
                  name="dietaryTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Dietary Tags
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          className="w-full"
                          onValuesChange={field.onChange}
                          options={dietaryOptions}
                          placeholder=" -> Dietary tags"
                          triggerClassName="min-h-10"
                          values={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Allergens field ======= ~ */}
                <FormField
                  control={form.control}
                  name="allergens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Contains Allergens
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          className="w-full"
                          onValuesChange={field.onChange}
                          options={allergenOptions}
                          placeholder="-> Allergens in item..."
                          triggerClassName="min-h-10"
                          values={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= May contain field ======= ~ */}
                <FormField
                  control={form.control}
                  name="mayContain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        May Contain Traces
                      </FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          className="w-full"
                          onValuesChange={field.onChange}
                          options={allergenOptions}
                          placeholder="-> May contain..."
                          triggerClassName="min-h-10"
                          values={field.value}
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
            <div className="space-y-6 rounded-2xl bg-muted/40 p-4 dark:bg-muted">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background p-2">
                  <IconSettings
                    className="h-5 w-5 text-primary"
                    size={20}
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">
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
                      className="group rounded-lg border border-border/50 bg-card transition-all hover:border-border hover:shadow-sm"
                      key={option.position}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-between gap-4 p-4">
                          <div className="flex items-center gap-3">
                            <Package2Icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium text-sm">
                                {option.name}
                              </h4>
                              <p className="text-muted-foreground text-xs">
                                {option.picks.length} option
                                {option.picks.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <ChevronDownIcon className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-border/30 border-t p-4 pt-3">
                          {option.description && (
                            <p className="mb-3 text-muted-foreground text-sm">
                              {option.description}
                            </p>
                          )}
                          <div className="space-y-2">
                            {option.picks.map((pick) => (
                              <div
                                className="space-y-2 rounded-md bg-muted/30 p-3"
                                key={pick.name}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">
                                    {pick.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <BanknoteIcon className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium text-sm">
                                      {CURRENCY_SYMBOLS[pick.price.currency] ??
                                        pick.price.currency}
                                      {pick.price.amount.toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                {/* Additional pick details */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  {pick.calories && (
                                    <div className="flex items-center gap-1 rounded bg-background/50 px-2 py-1">
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
                                            className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-green-700"
                                            key={String(tag)}
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
                                            className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-amber-700"
                                            key={String(allergen)}
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
                  className="mt-4 w-full"
                  onClick={() => setShowCreateMenuItemOptionPanel(true)}
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add option
                </Button>
                <CreateMenuItemOptionPanel
                  onOpenChange={setShowCreateMenuItemOptionPanel}
                  open={showCreateMenuItemOptionPanel}
                  setFormState={setMenuItemOptions}
                />
              </div>
            </div>

            {/* ~ =================================== ~ */}
            {/* -- Pricing section -- */}
            {/* ~ =================================== ~ */}
            <div className="space-y-6 rounded-2xl bg-muted/40 p-4 md:p-8 dark:bg-muted">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background p-2">
                  <BanknoteIcon
                    className="h-5 w-5 text-primary"
                    size={20}
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">
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
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Base Price
                      </FormLabel>
                      <FormControl>
                        <NumberField
                          aria-label="Base Price"
                          defaultValue={field.value.amount}
                          formatOptions={{
                            style: "currency",
                            currency: field.value.currency,
                            currencySign: "standard",
                          }}
                          onChange={(value) =>
                            field.onChange({ ...field.value, amount: value })
                          }
                        >
                          <Group className="relative flex h-10 w-full items-center overflow-hidden rounded-lg border border-input bg-background text-sm shadow-xs transition-all focus-within:ring-2 focus-within:ring-primary/20">
                            <AriaInput className="flex-1 bg-transparent px-3 py-2 tabular-nums outline-none dark:bg-input/30" />
                            <div className="flex h-full flex-col border-input border-l">
                              <Button
                                className="flex h-1/2 w-8 items-center justify-center border-input border-b bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                slot="increment"
                                type="button"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                className="flex h-1/2 w-8 items-center justify-center bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                slot="decrement"
                                type="button"
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
                  control={form.control}
                  name="promotionalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Promotional Price
                        <span className="ml-2 font-normal text-muted-foreground text-xs">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <NumberField
                          aria-label="Discount Price"
                          defaultValue={field.value.amount}
                          formatOptions={{
                            style: "currency",
                            currency: field.value.currency,
                            currencySign: "standard",
                          }}
                          onChange={(value) =>
                            field.onChange({ ...field.value, amount: value })
                          }
                        >
                          <Group className="relative flex h-10 w-full items-center overflow-hidden rounded-lg border border-input bg-background text-sm shadow-xs transition-all focus-within:ring-2 focus-within:ring-primary/20">
                            <AriaInput className="flex-1 bg-transparent px-3 py-2 tabular-nums outline-none dark:bg-input/30" />
                            <div className="flex h-full flex-col border-input border-l">
                              <Button
                                className="flex h-1/2 w-8 items-center justify-center border-input border-b bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                slot="increment"
                                type="button"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                className="flex h-1/2 w-8 items-center justify-center bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                slot="decrement"
                                type="button"
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
            className="min-w-[100px]"
            onClick={() => navigate(-1)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="min-w-[100px] gap-2"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
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
