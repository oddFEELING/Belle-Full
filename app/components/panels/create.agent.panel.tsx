import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Panel,
  PanelActionButton,
  PanelCancelButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "~/components/ui/panel";
import { PhoneInput } from "../custom-ui/phone.input";
import {
  Form,
  FormControl,
  FormDescription,
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
import type { PanelProps } from "./panel.types";

interface CreateAgentPanelProps extends PanelProps {
  restaurantId: Id<"restaurants">;
}

const createAgentSchema = z.object({
  name: z.string(),
  type: z.enum(["whatsapp", "instagram"]),
  supervisor_number: z.string(),
  agent_id: z.string(),
});
type CreateAgentSchema = z.infer<typeof createAgentSchema>;

export const CreateAgentPanel: React.FC<CreateAgentPanelProps> = ({
  open,
  onOpenChange,
  restaurantId,
}) => {
  const createAgent = useMutation(api.features.agents.functions.createDBAgent);

  // ~ ======= Form instance ======= ~
  const form = useForm<CreateAgentSchema>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      type: "whatsapp",
      agent_id: "",
      supervisor_number: "",
    },
  });

  // ~ ======= Hanle submit  ======= ~
  const onSubmit = async (data: CreateAgentSchema) => {
    await createAgent({ ...data, restaurant: restaurantId });
    onOpenChange(false);
    form.reset();
  };

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Panel onOpenChange={onOpenChange} open={open}>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>Create new Agent</PanelTitle>
        </PanelHeader>

        <Form {...form}>
          <form
            className="mt-5 grid grid-cols-2 gap-4 gap-y-8 px-4 md:px-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* ~ ======= Agent name field ======= ~ */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Sushi bot" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Agent type field ======= ~ */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                        <SelectItem value="whatsapp">
                          <IconBrandWhatsapp
                            className="text-muted-foreground"
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>WhatsApp</span>
                        </SelectItem>
                        <SelectItem aria-disabled disabled value="instagram">
                          <IconBrandInstagram
                            className="text-muted-foreground"
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>
                            Instagram{" "}
                            <span className="text-muted-foreground text-xs italic">
                              (Coming soon)
                            </span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ~ ======= Agent ID field ======= ~ */}
            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {form.watch("type") === "instagram" ? (
                      <span>Instagram username</span>
                    ) : (
                      <span>Whatsapp id</span>
                    )}
                  </FormLabel>
                  <FormDescription>
                    Whatsapp number with country code.
                  </FormDescription>
                  <FormControl>
                    <PhoneInput
                      placeholder="00 000 000 00 00"
                      {...field}
                      defaultCountry="GB"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Supervisor number field ======= ~ */}
            <FormField
              control={form.control}
              name="supervisor_number"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Supervisor number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="00 000 000 00 00"
                      {...field}
                      defaultCountry="GB"
                    />
                  </FormControl>
                  <FormDescription>
                    Sometimes the agents would report members that violate terms
                    to the supervisors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Actions ======= ~ */}
            <PanelFooter className="col-span-2">
              <PanelCancelButton onClick={() => onOpenChange(false)}>
                Cancel
              </PanelCancelButton>
              <PanelActionButton type="submit">Create Agent</PanelActionButton>
            </PanelFooter>
          </form>
        </Form>
      </PanelContent>
    </Panel>
  );
};
