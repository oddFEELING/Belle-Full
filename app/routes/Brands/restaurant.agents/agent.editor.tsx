import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React, { useEffect } from "react";
import { z } from "zod";
import { useParams } from "react-router";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/resizable";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "~/lib/logger";
import { Separator } from "~/components/ui/separator";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "~/components/ui/form";
import { PhoneInput } from "~/components/custom-ui/phone.input";
import { ValueMultiSelector } from "~/components/custom-ui/value-multi-select";
import { Button } from "~/components/ui/button";
import { AgentEditorPanel } from "./partials/agent.editor.panel";
import { useMutation } from "convex/react";

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
    { agent: agentId },
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
        <ResizablePanel maxSize={35} minSize={30} defaultSize={30}>
          <div className="restaurant-dashboard--page h-full w-full">
            <h3 className="text-lg font-semibold">Agent Editor</h3>
            <p className="text-muted-foreground text-sm">
              This is where you can manage the details of your agent. Agent
              names cannot be changed.
            </p>

            <div className="flex w-full flex-col p-2"></div>

            <Separator className="my-2" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 grid w-full space-y-4"
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
                          values={field.value}
                          onValuesChange={field.onChange}
                          options={AgentTraits}
                          placeholder="-> Traits"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Buttons ======= ~ */}
                <div className="flex w-full items-center justify-end gap-2">
                  <Button size="sm" disabled={!form.formState.isDirty}>
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
