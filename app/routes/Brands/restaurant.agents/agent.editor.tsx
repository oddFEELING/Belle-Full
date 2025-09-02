import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";
import { PhoneInput } from "~/components/custom-ui/phone.input";
import { ValueMultiSelector } from "~/components/custom-ui/value-multi-select";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Separator } from "~/components/ui/separator";
import { useCachedQuery } from "~/hooks/use-app-query";
import { logger } from "~/lib/logger";
import { AgentEditorPanel } from "./partials/agent.editor.panel";

const agentFormSchema = z.object({
  traits: z.array(z.string()),
  supervisor_number: z.string(),
});
type AgentFormSchema = z.infer<typeof agentFormSchema>;

const RestaurantAgentEditor = () => {
  const agentId = useParams().agentId as Id<"restaurant_agents">;

  // ~ ======= Queries ======= ~
  const { data: agent, isPending: agentIsPending } = useCachedQuery(
    api.features.agents.functions.getSingleAgent,
    { agent: agentId }
  );
  const updateAgent = useMutation(api.features.agents.functions.updateAgent);

  const form = useForm<AgentFormSchema>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      traits: agent?.traits || [],
      supervisor_number: agent?.supervisor_number || "",
    },
  });

  // ~ ======= Handle submit  ======= ~
  const onSubmit = async (data: AgentFormSchema) => {
    console.log(data);
    await updateAgent({
      agent: agentId,
      updateData: {
        supervisor_number: data.supervisor_number,
        traits: data.traits,
      },
    });

    form.reset();
  };

  // ~ ======= Update form when agent changes ======= ~
  useEffect(() => {
    if (agent) {
      form.setValue("traits", agent.traits || []);
      form.setValue("supervisor_number", agent.supervisor_number || "");
    }
  }, [agent]);

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="h-[var(--content-height)] w-full">
            {agent && <AgentEditorPanel agent={agent} />}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* ~ =================================== ~ */}
        {/* -- Editor side panel -- */}
        {/* ~ =================================== ~ */}
        <ResizablePanel defaultSize={30} maxSize={35} minSize={30}>
          <div className="restaurant-dashboard--page h-full w-full">
            <h3 className="font-semibold text-lg">Agent Editor</h3>
            <p className="text-muted-foreground text-sm">
              This is where you can manage the details of your agent. Agent
              names cannot be changed.
            </p>

            <div className="flex w-full flex-col p-2" />

            <Separator className="my-2" />

            <Form {...form}>
              <form
                className="mt-6 grid w-full space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* ~ ======= Supervisor number field ======= ~ */}
                <FormField
                  control={form.control}
                  name="supervisor_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor number</FormLabel>
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

                {/* ~ ======= Traits Field ======= ~ */}
                <FormField
                  control={form.control}
                  name="traits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traits</FormLabel>
                      <FormControl>
                        <ValueMultiSelector
                          onValuesChange={field.onChange}
                          options={AgentTraits}
                          placeholder="-> Traits"
                          values={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Buttons ======= ~ */}
                <div className="flex w-full items-center justify-end gap-2">
                  <Button disabled={!form.formState.isDirty} size="sm">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RestaurantAgentEditor;

const AgentTraits: { label: string; value: string }[] = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Funny", value: "funny" },
  { label: "Sarcastic", value: "sarcastic" },
  { label: "Grumpy", value: "grumpy" },
  { label: "Annoying", value: "annoying" },
  { label: "Humorous", value: "humorous" },
  { label: "Confident", value: "confident" },
];
