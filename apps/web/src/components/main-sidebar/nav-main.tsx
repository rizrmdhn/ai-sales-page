"use client";

import { type TablerIcon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export function NavMain({
  navItems,
}: {
  navItems: {
    name: string;
    url: string;
    icon: TablerIcon;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              render={
                <Link
                  to={item.url}
                  activeProps={{ "data-active": true }}
                  activeOptions={{ exact: true }}
                />
              }
            >
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
