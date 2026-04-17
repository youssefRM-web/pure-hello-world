import { useState } from "react";
import { AdminSidebar, AdminMobileMenuButton } from "./AdminSidebar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { admin } = useAdminAuth();

  return (
    <div className="flex h-screen bg-[hsl(var(--admin-background))] overflow-hidden">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-card))] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <AdminMobileMenuButton onClick={() => setIsMobileOpen(true)} />
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2.5 py-1 rounded-full bg-[hsl(var(--admin-accent))]/10 text-[hsl(var(--admin-accent))] font-medium text-xs">
              Admin
            </span>
            <span className="text-foreground/80 font-medium">
              {(admin?.email as string) || "Administrator"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
