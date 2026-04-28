import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

export const Route = createFileRoute("/(core)/sales-pages/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data: page, isLoading } = useQuery(
    trpc.salesPage.detail.queryOptions({ id }),
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!page?.generatedContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">No generated content available.</p>
        <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
          <IconArrowLeft />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const c = page.generatedContent;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          <IconArrowLeft />
          Back
        </Button>
        <h1 className="text-xl font-bold">{page.productName}</h1>
        <Badge variant="default">Generated</Badge>
      </div>

      <Separator />

      {/* Hero */}
      <section className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{c.headline}</h2>
        <p className="text-lg text-muted-foreground">{c.subHeadline}</p>
      </section>

      {/* Product Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {c.productDescription}
          </p>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {c.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <IconCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.features.map((feature, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      {c.socialProof && (
        <blockquote className="border-l-4 border-border pl-4 text-sm italic text-muted-foreground">
          &ldquo;{c.socialProof}&rdquo;
        </blockquote>
      )}

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{c.pricing.price}</span>
            <span className="text-sm text-muted-foreground">
              {c.pricing.label}
            </span>
          </div>
          {c.pricing.note && (
            <p className="text-xs text-muted-foreground">{c.pricing.note}</p>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-muted/40 px-6 py-8 text-center">
        <Button size="lg">{c.cta.text}</Button>
        {c.cta.subText && (
          <p className="text-xs text-muted-foreground">{c.cta.subText}</p>
        )}
      </div>
    </div>
  );
}
