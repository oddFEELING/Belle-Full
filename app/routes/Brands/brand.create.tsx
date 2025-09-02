import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { logger } from "~/lib/logger";

const brandSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  website: z.string(),
  phone: z.string(),
});

type BrandSchema = z.infer<typeof brandSchema>;

const CreateBrandPage = () => {
  const navigate = useNavigate();
  const createBrand = useMutation(api.features.brands.functions.createBrand);
  const generateBrandSlug = useMutation(
    api.features.brands.functions.generateBrandSlug
  );

  // ~ ======= Form instance ======= ~
  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      website: "",
      phone: "",
    },
  });

  // ~ ======= Handle submit ======= ~
  const onSubmit = async (data: BrandSchema) => {
    const brandId = await createBrand(data);
    logger.debug({ brandId });
    navigate(`/brands/${brandId}/hub`);
  };

  const generaeSlug = useCallback(async () => {
    if (form.getValues("name").length !== 3) return;
    const slug = await generateBrandSlug({
      brandName: form.getValues("name"),
      currentSlug: form.getValues("slug"),
    });
    logger.debug({ slug });
    if (slug?.data) {
      form.setValue("slug", slug.data);
      form.clearErrors("slug");
    } else if (slug?.error) {
      form.setValue("slug", slug?.error);
    }
  }, [form.watch("name")]);

  useEffect(() => {
    generaeSlug();
  });

  return (
    <div className="no-scroll-full-page mt-20 flex justify-center md:mt-0 md:items-center">
      <div className="flex h-max w-full max-w-xl flex-col items-center gap-y-3 px-5 md:px-8">
        <h2 className="font-semibold text-2xl">
          Create your <span className="text-primary">Brand</span>
        </h2>
        <p className="-mt-2 text-center text-muted-foreground">
          Create your brand first and then add restaurants to it.
        </p>

        <Form {...form}>
          <form
            className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* ~ ======= Brand name ======= ~ */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Brand name</FormLabel>
                  <FormControl>
                    <Input required {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand slug ======= ~ */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    Slug&nbsp;
                    <span className="font-light text-muted-foreground">
                      (auto generated)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input required {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand description ======= ~ */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      {...field}
                      className="h-25 resize-none"
                      placeholder="✨ Describe your brand"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand website ======= ~ */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} placeholder="your-site.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand phone number ======= ~ */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} placeholder="123-456-7890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 mt-5 flex w-full items-center justify-center">
              <Button className="w-full" size="lg" type="submit">
                Create brand
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateBrandPage;
