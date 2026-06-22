import { Link, useRouterState } from "@tanstack/react-router";
import { History, LayoutDashboard, ScrollText, Send, FileText, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FEATURES } from "@/config/features";

const items = [
  ...(FEATURES.ENABLE_ANALYTICS_DASHBOARD
    ? [{ title: "Gösterge Paneli", url: "/", icon: LayoutDashboard }]
    : []),
  { title: "SMS Gönder", url: "/send", icon: Send },
  { title: "Şablonlar", url: "/templates", icon: FileText },
  { title: "SMS Geçmişi", url: "/history", icon: History },
  { title: "Sistem Kayıtları", url: "/logs", icon: ScrollText },
  { title: "Profil", url: "/profile", icon: User },
] as const;

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
