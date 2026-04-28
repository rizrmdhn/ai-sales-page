import {
  SalesPageCard,
  SalesPageCardSkeleton,
} from "@/components/sales-page-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useDebounced from "@/hooks/use-debounced";
import { trpc } from "@/utils/trpc";
import { IconFileOff, IconPlus, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import z from "zod";

export const Route = createFileRoute("/(core)/dashboard")({
  validateSearch: z.object({
    search: z.optional(z.string()),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  const [search, setSearch] = useState(params.search ?? "");
  const debouncedSearch = useDebounced(search, 400);

  const { data: salesPages, isLoading } = useQuery(
    trpc.salesPage.list.queryOptions({
      search: debouncedSearch || undefined,
    }),
  );

  useEffect(() => {
    navigate({
      search: { search: debouncedSearch || undefined },
      replace: true,
    });
  }, [debouncedSearch]);

  const renderSalesPages = () => {
    if (isLoading) {
      return (
        <div className="flex w-full animate-pulse flex-row items-start justify-start gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SalesPageCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (salesPages?.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconFileOff />
            </EmptyMedia>
            <EmptyTitle>No sales pages yet</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              Create your first AI-generated sales page to get started.
            </EmptyDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/new-page" })}
            >
              <IconPlus />
              New Page
            </Button>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {salesPages?.map((page) => (
          <SalesPageCard key={page.id} {...page} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 px-4">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">My Sales Page</h1>
          <p className="text-muted-foreground">
            Create and manage your AI-generated sales pages all in one place.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/new-page" })}>
          <IconPlus className="mr-2" />
          New Page
        </Button>
      </div>
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
      </InputGroup>
      {renderSalesPages()}
    </div>
  );
}
