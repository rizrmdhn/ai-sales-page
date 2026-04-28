import { AuthHeader } from "@/components/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { globalErrorToast, globalSuccessToast } from "@/lib/toasts";
import { trpc } from "@/utils/trpc";
import {
  RegisterInput,
  registerSchema,
} from "@ai-sales-page/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Route = createFileRoute("/(auth)/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const [type, setType] = useState<"text" | "password">("password");

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        globalSuccessToast("Account created successfully!");
        navigate({ to: "/login" });
      },
      onError: (error) => {
        globalErrorToast(error.message);
      },
    }),
  );

  const handleSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col bg-background h-dvh">
      <AuthHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-2"
            >
              <FieldGroup className="gap-4">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex flex-col gap-1.5"
                    >
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Input your name"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex flex-col gap-1.5"
                    >
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        placeholder="Input your email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <FieldLabel>Password</FieldLabel>
                      </div>

                      <div className="relative">
                        <Input
                          placeholder="Input your password"
                          type={type}
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2"
                          onClick={() => {
                            setType((prev) =>
                              prev === "password" ? "text" : "password",
                            );
                          }}
                          aria-label={
                            type === "password"
                              ? "Show password"
                              : "Hide password"
                          }
                        >
                          {type === "password" ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? <Spinner /> : null}
                  Create Account
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
