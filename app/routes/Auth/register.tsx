import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
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
import { Separator } from "~/components/ui/separator";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
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
      <Button
        className="absolute top-4 right-20"
        onClick={() => navigate("/signin")}
        variant="ghost"
      >
        <span>Login</span>
      </Button>
      <div className="flex h-max w-full max-w-md flex-col items-center gap-y-3">
        <h2 className="font-semibold text-2xl">Create an account</h2>
        <p className="-mt-2 text-center text-muted-foreground">
          Enter your email below to create an account.
        </p>
        <Form {...form}>
          <form
            className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
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
                          className="absolute right-3 cursor-pointer text-muted-foreground"
                          onClick={() => setShowPassword(false)}
                          size={20}
                          strokeWidth={1.5}
                        />
                      ) : (
                        <IconEyeOff
                          className="absolute right-3 cursor-pointer text-muted-foreground"
                          onClick={() => setShowPassword(true)}
                          size={20}
                          strokeWidth={1.5}
                        />
                      )}

                      <Input
                        required
                        type={showPassword ? "text" : "password"}
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
              <Button size="lg" type="submit">
                Create account
              </Button>

              <div className="flex w-full items-center justify-center gap-5 overflow-hidden">
                <Separator className="max-w-25" />
                <span className="text-center text-muted-foreground text-sm">
                  OR
                </span>
                <Separator className="max-w-25" />
              </div>

              <Button size="lg" type="button" variant="outline">
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
