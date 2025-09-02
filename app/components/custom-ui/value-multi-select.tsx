import React, { useMemo } from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  type MultiSelectValue,
} from "~/components/custom-ui/multi-select";
import { cn } from "~/lib/utils";

type ValueMultiSelectorProps = {
  // The selected values as primitive strings
  values: string[];
  // Emits only string[] when selection changes
  onValuesChange: (values: string[]) => void;
  // Available options used for rendering and label lookup
  options: MultiSelectValue[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  inputClassName?: string;
  listClassName?: string;
};

export function ValueMultiSelector({
  values,
  onValuesChange,
  options,
  placeholder = "",
  className,
  triggerClassName,
  inputClassName,
  listClassName,
}: ValueMultiSelectorProps) {
  // Maps string[] into the shape expected by MultiSelector
  const objectValues = useMemo(() => {
    const labelByValue = new Map(options.map((o) => [o.value, o.label]));
    return values.map((v) => ({ value: v, label: labelByValue.get(v) ?? v }));
  }, [values, options]);

  // Adapts MultiSelector's object[] back to string[] for consumers
  const handleObjectChange = (items: MultiSelectValue[]) => {
    onValuesChange(items.map((i) => i.value));
  };

  return (
    <MultiSelector
      className={className}
      onValuesChange={handleObjectChange}
      values={objectValues}
    >
      <MultiSelectorTrigger
        className={cn(
          "rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20",
          triggerClassName
        )}
      >
        <MultiSelectorInput
          className={cn("text-sm", inputClassName)}
          placeholder={placeholder}
        />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList className={listClassName}>
          {options.map((opt) => (
            <MultiSelectorItem
              key={opt.value}
              label={opt.label}
              value={opt.value}
            >
              {opt.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
}

export type { MultiSelectValue };
