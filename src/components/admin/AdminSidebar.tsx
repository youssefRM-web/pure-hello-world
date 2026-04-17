import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ClipboardList,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: Store, label: "Restaurants", path: "/admin/restaurants" },
  { icon: UtensilsCrossed, label: "Menus", path: "/admin/menus" },
  { icon: ClipboardList, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "h-screen bg-[hsl(var(--admin-sidebar))] text-[hsl(var(--admin-sidebar-foreground))] border-r border-[hsl(var(--admin-border))] flex flex-col transition-all duration-300 z-50 flex-shrink-0",
          isCollapsed ? "w-16" : "w-60",
          "fixed lg:sticky lg:top-0",
          isMobileOpen ? "left-0" : "-left-full lg:left-0"
        )}
      >
        <div
          className={cn(
            "p-4 flex items-center border-b border-[hsl(var(--admin-border))]",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[hsl(var(--admin-accent))] flex-shrink-0" />
            <span
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-all duration-300",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto delay-150"
              )}
            >
              Admin
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isCollapsed && "justify-center px-2",
                      isActive
                        ? "bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))]"
                        : "hover:bg-white/10"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-all duration-300",
                        isCollapsed
                          ? "opacity-0 w-0 overflow-hidden"
                          : "opacity-100 w-auto delay-150"
                      )}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-[hsl(var(--admin-border))]">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors w-full",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto delay-150"
              )}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminMobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
    >
      <Menu className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
