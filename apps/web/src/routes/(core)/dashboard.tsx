import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(core)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 px-4">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">My Sales Page</h1>
          <p className="text-muted-foreground">
            3 page generated, 1 page in progress.{" "}
          </p>
        </div>
        <Button variant="outline">
          <IconPlus className="mr-2" />
          New Page
        </Button>
      </div>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="Search pages..." />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
    </div>
  );
}
