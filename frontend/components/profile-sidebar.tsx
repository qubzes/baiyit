"use client";

import { useRouter } from "next/navigation";
import {
  LogOut,
  ShoppingBag,
  User,
  CreditCard,
  MessageSquare,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    { id: "account", label: "Account", icon: User },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "askBaiyit", label: "Ask Baiyit", icon: MessageSquare },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
