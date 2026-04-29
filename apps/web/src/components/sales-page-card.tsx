import type { SalesPage } from "@ai-sales-page/types/sales-pages.types.ts";
import { IconEye, IconRefresh, IconTrash } from "@tabler/icons-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

interface SalesPageCardProps extends SalesPage {
  onView?: () => void;
  onRetry?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isRetrying?: boolean;
}

const statusVariant: Record<
  NonNullable<SalesPage["status"]>,
  "default" | "outline" | "destructive"
> = {
  pending: "outline",
  generated: "default",
  failed: "destructive",
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function SalesPageCardSkeleton() {
  return (
    <Card className="w-64">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-8 w-full rounded-md border-l-2" />
      </CardContent>
      <CardFooter className="justify-between border-t pt-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-14 rounded-sm" />
      </CardFooter>
    </Card>
  );
}

export function SalesPageCard({
  productName,
  description,
  status,
  generatedContent,
  createdAt,
  onView,
  onRetry,
  onDelete,
  isDeleting = false,
  isRetrying = false,
}: SalesPageCardProps) {
  const busy = isDeleting || isRetrying;

  return (
    <Card className="w-64">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{productName}</CardTitle>
          {status && (
            <Badge variant={statusVariant[status]}>
              {isRetrying
                ? "Retrying…"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {generatedContent?.headline && (
          <p className="line-clamp-2 border-l-2 border-border pl-2 text-xs italic text-muted-foreground">
            &ldquo;{generatedContent.headline}&rdquo;
          </p>
        )}
        {status === "failed" && !isRetrying && (
          <p className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
            Generation failed. Click retry to try again.
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t pt-3">
        <span className="text-[11px] text-muted-foreground">
          {formatDate(createdAt)}
        </span>
        <div className="flex gap-1">
          {status === "generated" && (
            <Button variant="ghost" size="xs" onClick={onView} disabled={busy}>
              <IconEye />
              View
            </Button>
          )}
          {status === "failed" && (
            <Button variant="ghost" size="xs" onClick={onRetry} disabled={busy}>
              {isRetrying ? <Spinner /> : <IconRefresh />}
              Retry
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            disabled={busy}
          >
            {isDeleting ? <Spinner /> : <IconTrash />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
