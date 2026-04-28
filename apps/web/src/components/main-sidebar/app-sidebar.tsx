import { IconLayoutDashboard, IconPlus } from "@tabler/icons-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ModeToggle } from "../mode-toggle";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const navItems = [
  { name: "Dashboard", icon: IconLayoutDashboard, url: "/dashboard" },
  { name: "New Page", icon: IconPlus, url: "/new-page" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useQuery(trpc.auth.me.queryOptions());

  if (!user) return null;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-border border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Acme</h1>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navItems={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
