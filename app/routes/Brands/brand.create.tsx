import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "~/lib/logger";
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
import { Button } from "~/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

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
  const createBrand = useMutation(api.brands.functions.createBrand);
  const generateBrandSlug = useMutation(api.brands.functions.generateBrandSlug);

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
    navigate(`/brands/hub/${brandId}`);
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
        <h2 className="text-2xl font-semibold">Create your Brand</h2>
        <p className="text-muted-foreground -mt-2 text-center">
          Create your brand first and then add restaurants to it.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-5"
          >
            {/* ~ ======= Brand name ======= ~ */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Brand name</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand slug ======= ~ */}
            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    Slug&nbsp;
                    <span className="text-muted-foreground font-light">
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
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      {...field}
                      rows={5}
                      placeholder="✨ Describe your brand"
                      className="h-25 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Brand website ======= ~ */}
            <FormField
              name="website"
              control={form.control}
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
              name="phone"
              control={form.control}
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
              <Button type="submit" size="lg" className="w-full">
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
