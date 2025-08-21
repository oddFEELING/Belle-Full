import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Separator } from "~/components/ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z.string(),
  flow: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // ~ ======= Form instance ======= ~
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      flow: "signUp",
    },
  });

  // ~ ======= Submit handler ======= ~
  const onSubmit = async (data: FormSchema) => {
    await signIn("password", {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      flow: data.flow,
    });

    navigate("/");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center p-5 lg:p-20">
      <Button variant="ghost" className="absolute top-4 right-20">
        <span>Login</span>
      </Button>
      <div className="flex h-max w-full max-w-md flex-col items-center gap-y-3">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-muted-foreground -mt-2 text-center">
          Enter your email below to create an account.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-5"
          >
            {/* ~ ======= First name field ======= ~ */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ~ ======= Last name field ======= ~ */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ~ ======= Email field ======= ~ */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      required
                      {...field}
                      placeholder="example@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ~ ======= Password field ======= ~ */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      {showPassword ? (
                        <IconEye
                          size={20}
                          strokeWidth={1.5}
                          onClick={() => setShowPassword(false)}
                          className="text-muted-foreground absolute right-3 cursor-pointer"
                        />
                      ) : (
                        <IconEyeOff
                          size={20}
                          strokeWidth={1.5}
                          onClick={() => setShowPassword(true)}
                          className="text-muted-foreground absolute right-3 cursor-pointer"
                        />
                      )}

                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        {...field}
                        className="pr-8"
                        placeholder="* * * * * * * *"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex w-full flex-col gap-y-3">
              <Button type="submit" size="lg">
                Create account
              </Button>

              <div className="flex w-full items-center justify-center gap-5 overflow-hidden">
                <Separator className="max-w-25" />
                <span className="text-muted-foreground text-center text-sm">
                  OR
                </span>
                <Separator className="max-w-25" />
              </div>

              <Button type="button" variant="outline" size="lg">
                <span>Continue With Google</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default RegisterPage;
