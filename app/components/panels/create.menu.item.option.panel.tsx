import { zodResolver } from "@hookform/resolvers/zod";
import { AllergenEnum, DietaryTagEnum } from "convex/types/enums";
import type { MenuItemOption, Money } from "convex/types/shared";
import { Trash } from "iconsax-reactjs";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Input as AriaInput, Group, NumberField } from "react-aria-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { logger } from "~/lib/logger";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../custom-ui/multi-select";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import type { PanelProps } from "./panel.types";

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
          typeof item === "object" && item.value ? item.value : item
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
    data: Partial<MenuItemOption["picks"][number]>
  ) => {
    setPicks((prev) =>
      prev.map((pick, i) => (i === idx ? { ...pick, ...data } : pick))
    );
  };

  // ~ ======= Handle remove pick  ======= ~
  const handleRemovePick = (idx: number) => {
    setPicks((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="md:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add option</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            className="flex h-full flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
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
                          <SelectTrigger className="h-10 w-full rounded-lg transition-all focus:ring-2 focus:ring-primary/20">
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="h-20 resize-none"
                          placeholder="Describe the option"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-8" />
              <h3 className="font-medium text-lg">Picks</h3>

              {/* ~ ======= Picks ======= ~ */}
              <div className="">
                {picks.map((pick, idx) => (
                  <div
                    className="mt-3 grid w-full grid-cols-2 gap-4 rounded-xl border bg-muted/90 p-4 dark:bg-muted"
                    key={idx}
                  >
                    {/* ~ ======= Pick name ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Name</Label>
                      <Input
                        onChange={(e) =>
                          handlePickDataChange(idx, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Pick name"
                        value={pick.name}
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
                    </div>

                    {/* ~ ======= Pick calories ======= ~ */}
                    <div className="flex flex-col gap-1">
                      <Label>Calories</Label>
                      <div className="relative">
                        <Input
                          className="h-10 rounded-lg bg-transparent pr-16 transition-all focus:ring-2 focus:ring-primary/20 dark:bg-input/30"
                          onChange={(e) =>
                            handlePickDataChange(idx, {
                              calories: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="e.g. 450"
                          type="number"
                          value={pick.calories || ""}
                        />
                        <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                          kcal
                        </span>
                      </div>
                    </div>

                    {/* ~ ======= Pick dietary tags ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Dietary tags</Label>
                      <MultiSelector
                        className="w-full"
                        onValuesChange={(values) =>
                          handlePickDataChange(idx, {
                            dietaryTags: values as any[],
                          })
                        }
                        values={pick.dietaryTags as any[]}
                      >
                        <MultiSelectorTrigger className="min-h-10 rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20">
                          <MultiSelectorInput placeholder=" -> Dietary tags" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {Object.entries(DietaryTagEnum)?.map(
                              ([key, value]) => (
                                <MultiSelectorItem
                                  key={key}
                                  label={key}
                                  value={value}
                                >
                                  {key}
                                </MultiSelectorItem>
                              )
                            )}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </div>

                    {/* ~ ======= Pick allergens ======= ~ */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <Label>Allergens</Label>
                      <MultiSelector
                        className="w-full"
                        onValuesChange={(values) =>
                          handlePickDataChange(idx, {
                            allergens: values as any[],
                          })
                        }
                        values={pick.allergens as any[]}
                      >
                        <MultiSelectorTrigger className="min-h-10 rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20">
                          <MultiSelectorInput placeholder=" -> Allergens" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {Object.entries(AllergenEnum)?.map(
                              ([key, value]) => (
                                <MultiSelectorItem
                                  key={key}
                                  label={key}
                                  value={value}
                                >
                                  {key}
                                </MultiSelectorItem>
                              )
                            )}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </div>

                    {/* ~ ======= Remove pick button ======= ~ */}
                    <div className="col-span-2 mt-2 flex w-full justify-end">
                      <Button
                        className="text-destructive-foreground"
                        onClick={() => handleRemovePick(idx)}
                        size="xs"
                        type="button"
                        variant="destructive"
                      >
                        <Trash strokeWidth={1.3} />
                        <span> Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
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
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add pick
                </Button>
              </div>
            </ScrollArea>

            {/* ~ ======= Actions= ======= ~ */}
            <SheetFooter className="flex h-14 w-full flex-row items-center justify-end gap-2">
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={picks.length === 0}
                onClick={() => onSubmit(form.getValues())}
                type="button"
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
