import {
  IconChartPie,
  IconFrame,
  IconLifebuoy,
  IconMap,
  IconSend,
} from "@tabler/icons-react";
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
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: IconLifebuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: IconSend,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: IconFrame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: IconChartPie,
    },
    {
      name: "Travel",
      url: "#",
      icon: IconMap,
    },
  ],
};

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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
