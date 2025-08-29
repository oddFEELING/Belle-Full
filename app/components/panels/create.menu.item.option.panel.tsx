import { z } from "zod";
import React, { useState } from "react";
import type { PanelProps } from "./panel.types";
import type { MenuItemOption, Money } from "convex/types/shared";
import { AllergenEnum, DietaryTagEnum } from "convex/types/enums";
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
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Trash } from "iconsax-reactjs";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../custom-ui/multi-select";

import { NumberField, Input as AriaInput, Group } from "react-aria-components";
import { Separator } from "../ui/separator";

const createMenuItemOptionSchema = z.object({
  name: z.string(),
  isAvailable: z.boolean(),
  description: z.string(),
});

type CreateMenuItemOptionSchema = z.infer<typeof createMenuItemOptionSchema>;

interface CreateMenuItemOptionPanelProps extends PanelProps {
  setFormState: React.Dispatch<React.SetStateAction<MenuItemOption[]>>;
}

export const CreateMenuItemOptionPanel: React.FC<
  CreateMenuItemOptionPanelProps
> = ({ open, onOpenChange, setFormState }) => {
  const [picks, setPicks] = useState<MenuItemOption["picks"]>([]);

  // ~ ======= Form instance ======= ~
  const form = useForm<CreateMenuItemOptionSchema>({
    resolver: zodResolver(createMenuItemOptionSchema),
    defaultValues: {
      name: "",
      isAvailable: true,
      description: "",
    },
  });

  // ~ ======= Handle submit  ======= ~
  const onSubmit = (data: CreateMenuItemOptionSchema) => {
    // Extract values from MultiSelector objects in picks
    const extractValues = (items: any[]) => {
      return (
        items?.map((item) =>
          typeof item === "object" && item.value ? item.value : item,
        ) || []
      );
    };

    const processedPicks = picks.map((pick) => ({
      ...pick,
      dietaryTags: extractValues(pick.dietaryTags),
      allergens: extractValues(pick.allergens),
    }));

    setFormState((prev) => [
      ...prev,
      { ...data, picks: processedPicks, position: prev.length },
    ]);
    setPicks([]);
    form.reset();

    onOpenChange(false);
  };

  // ~ ======= Handle pick data change  ======= ~
  const handlePickDataChange = (
    idx: number,
    data: Partial<MenuItemOption["picks"][number]>,
  ) => {
    setPicks((prev) =>
      prev.map((pick, i) => (i === idx ? { ...pick, ...data } : pick)),
    );
  };

  // ~ ======= Handle remove pick  ======= ~
  const handleRemovePick = (idx: number) => {
    setPicks((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="md:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add option</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <ScrollArea className="h-[83dvh] w-full overflow-hidden px-4">
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
                {/* ~ ======= Name field  ======= ~ */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Name</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
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
                          <SelectTrigger className="focus:ring-primary/20 h-10 w-full rounded-lg transition-all focus:ring-2">
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the option"
                          className="h-20 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-8" />
              <h3 className="text-lg font-medium">Picks</h3>

              {/* ~ ======= Picks ======= ~ */}
              <div className="">
                {picks.map((pick, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/90 dark:bg-muted mt-3 grid w-full grid-cols-2 gap-4 rounded-xl border p-4"
                  >
                    {/* ~ ======= Pick name ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Name</Label>
                      <Input
                        placeholder="Pick name"
                        value={pick.name}
                        onChange={(e) =>
                          handlePickDataChange(idx, {
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* ~ ======= Pick price ======= ~ */}
                    <div className="flex flex-col gap-1">
                      <Label>Price</Label>
                      <NumberField
                        aria-label="Pick Price"
                        defaultValue={pick.price.amount}
                        formatOptions={{
                          style: "currency",
                          currency: pick.price.currency,
                          currencySign: "standard",
                        }}
                        onChange={(value) =>
                          handlePickDataChange(idx, {
                            price: { ...pick.price, amount: value },
                          })
                        }
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
                    </div>

                    {/* ~ ======= Pick calories ======= ~ */}
                    <div className="flex flex-col gap-1">
                      <Label>Calories</Label>
                      <div className="relative">
                        <Input
                          value={pick.calories || ""}
                          onChange={(e) =>
                            handlePickDataChange(idx, {
                              calories: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          type="number"
                          placeholder="e.g. 450"
                          className="focus:ring-primary/20 dark:bg-input/30 h-10 rounded-lg bg-transparent pr-16 transition-all focus:ring-2"
                        />
                        <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                          kcal
                        </span>
                      </div>
                    </div>

                    {/* ~ ======= Pick dietary tags ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Dietary tags</Label>
                      <MultiSelector
                        values={pick.dietaryTags as any[]}
                        onValuesChange={(values) =>
                          handlePickDataChange(idx, {
                            dietaryTags: values as any[],
                          })
                        }
                        className="w-full"
                      >
                        <MultiSelectorTrigger className="focus-within:ring-primary/20 min-h-10 rounded-lg transition-all focus-within:ring-2">
                          <MultiSelectorInput placeholder=" -> Dietary tags" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {Object.entries(DietaryTagEnum)?.map(
                              ([key, value]) => (
                                <MultiSelectorItem
                                  key={key}
                                  value={value}
                                  label={key}
                                >
                                  {key}
                                </MultiSelectorItem>
                              ),
                            )}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </div>

                    {/* ~ ======= Pick allergens ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Allergens</Label>
                      <MultiSelector
                        values={pick.allergens as any[]}
                        onValuesChange={(values) =>
                          handlePickDataChange(idx, {
                            allergens: values as any[],
                          })
                        }
                        className="w-full"
                      >
                        <MultiSelectorTrigger className="focus-within:ring-primary/20 min-h-10 rounded-lg transition-all focus-within:ring-2">
                          <MultiSelectorInput placeholder=" -> Allergens" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {Object.entries(AllergenEnum)?.map(
                              ([key, value]) => (
                                <MultiSelectorItem
                                  key={key}
                                  value={value}
                                  label={key}
                                >
                                  {key}
                                </MultiSelectorItem>
                              ),
                            )}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </div>

                    {/* ~ ======= Remove pick button ======= ~ */}
                    <div className="col-span-2 mt-2 flex w-full justify-end">
                      <Button
                        variant="destructive"
                        size="xs"
                        className="text-destructive-foreground"
                        type="button"
                        onClick={() => handleRemovePick(idx)}
                      >
                        <Trash strokeWidth={1.3} />
                        <span> Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  className="mt-5 w-full"
                  onClick={() =>
                    setPicks([
                      ...picks,
                      {
                        name: "",
                        price: { amount: 0, currency: "GBP" },
                        dietaryTags: [],
                        allergens: [],
                        calories: undefined,
                      },
                    ])
                  }
                >
                  <PlusIcon className="h-4 w-4" />
                  Add pick
                </Button>
              </div>
            </ScrollArea>

            {/* ~ ======= Actions= ======= ~ */}
            <SheetFooter className="flex h-14 w-full flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => onSubmit(form.getValues())}
                disabled={picks.length === 0}
              >
                Add to item
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
