import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { globalErrorToast, globalSuccessToast } from "@/lib/toasts";
import { trpc } from "@/utils/trpc";
import { promptSchema } from "@ai-sales-page/schema/prompt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = promptSchema.extend({
  features: z.array(
    z.object({ value: z.string().min(1, "Feature cannot be empty") }),
  ),
});
type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(core)/new-page")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const createMutation = useMutation(
    trpc.salesPage.create.mutationOptions({
      onSuccess: () => {
        globalSuccessToast("Sales page created!");
        navigate({ to: "/dashboard" });
      },
      onError: (error) => {
        globalErrorToast(error.message);
      },
    }),
  );

  const handleSubmit = (data: FormValues) => {
    createMutation.mutate({
      ...data,
      features: data.features.map((f) => f.value),
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">New Sales Page</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your product details and let AI generate your sales page.
        </p>
      </div>

      <Card className="w-full max-w-2xl min-h-0 flex-1 overflow-y-auto">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-2"
          >
            <FieldGroup className="gap-4">
              <Controller
                control={form.control}
                name="productName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product Name</FieldLabel>
                    <Input
                      placeholder="e.g. Acme SaaS Pro"
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
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      placeholder="Describe your product in a few sentences..."
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field
                data-invalid={!!form.formState.errors.features}
                className="gap-2"
              >
                <FieldLabel>Features</FieldLabel>
                <FieldDescription>
                  List the key features of your product.
                </FieldDescription>
                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller
                        control={form.control}
                        name={`features.${index}.value`}
                        render={({ field: inputField, fieldState }) => (
                          <Input
                            placeholder={`Feature ${index + 1}`}
                            {...inputField}
                            aria-invalid={fieldState.invalid}
                            className="flex-1"
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <IconTrash />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => append({ value: "" })}
                >
                  <IconPlus />
                  Add Feature
                </Button>
                {form.formState.errors.features && (
                  <FieldError
                    errors={[form.formState.errors.features as { message?: string }]}
                  />
                )}
              </Field>

              <Controller
                control={form.control}
                name="targetAudience"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Target Audience</FieldLabel>
                    <Input
                      placeholder="e.g. Small business owners, freelancers"
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
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      placeholder="e.g. $29/month or Free"
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
                name="usp"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Unique Selling Point</FieldLabel>
                    <FieldDescription>
                      What makes your product stand out from the competition?
                    </FieldDescription>
                    <Textarea
                      placeholder="e.g. The only tool that integrates with all your existing workflows in under 5 minutes"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard" })}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Spinner /> : null}
                  Generate Sales Page
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
