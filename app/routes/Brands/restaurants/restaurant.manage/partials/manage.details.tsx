import type { Doc } from "convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { logger } from "~/lib/logger";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const ManageDetailsSchema = z.object({
  description: z.string(),
  phone: z.string(),
});
type ManageDetailsForm = z.infer<typeof ManageDetailsSchema>;

type ManageDetailsProps = {
  restaurant: Doc<"restaurants">;
};
const ManageDetails = ({ restaurant }: ManageDetailsProps) => {
  const form = useForm<ManageDetailsForm>({
    resolver: zodResolver(ManageDetailsSchema),
    defaultValues: {
      description: restaurant.description ?? "",
      phone: restaurant.phone ?? "",
    },
  });

  const onSubmit = (data: ManageDetailsForm) => {
    logger.info({ data });
  };

  return (
    <section className="flex flex-col rounded-xl p-3 md:p-5">
      <h3 className="text-lg">Details</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 grid grid-cols-2 gap-5"
        >
          {/* ~ ======= Description field ======= ~ */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description for your restaurant"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ~ ======= Phone field ======= ~ */}
          <FormField
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-2 flex items-center justify-end">
            <Button>
              <span>Save</span>
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ManageDetails;
