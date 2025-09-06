import { useId } from "react";
import type { ControllerRenderProps } from "react-hook-form";

import { Input } from "~/components/ui/input";

type InputWithAddonProps = {
  addon: string;
  placeholder: string;
  type: string;
  field: ControllerRenderProps<any, any>;
};

export default function InputWithAddon({
  addon,
  placeholder,
  type,
  field,
}: InputWithAddonProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <div className="flex rounded-md shadow-xs">
        <span className="inline-flex items-center rounded-s-md border border-input bg-background px-3 text-muted-foreground text-sm">
          {addon}
        </span>
        <Input
          className="-ms-px rounded-s-none shadow-none"
          id={id}
          placeholder={placeholder}
          type={type}
          {...field}
        />
      </div>
    </div>
  );
}
