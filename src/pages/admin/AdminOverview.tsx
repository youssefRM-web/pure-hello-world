import { Store, UtensilsCrossed, ClipboardList, Users, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminRestaurants,
  useAdminMenus,
  useAdminOrders,
  useAdminUsers,
} from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";

interface StatProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  loading?: boolean;
  hint?: string;
}

function StatCard({ label, value, icon: Icon, loading, hint }: StatProps) {
  return (
    <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-2" />
        ) : (
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        )}
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div className="w-11 h-11 rounded-lg bg-[hsl(var(--admin-accent))]/10 flex items-center justify-center text-[hsl(var(--admin-accent))]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const restaurants = useAdminRestaurants();
  const menus = useAdminMenus();
  const orders = useAdminOrders();
  const users = useAdminUsers();

  const activeRestaurants =
    restaurants.data?.filter((r) => r.status === "active").length ?? 0;

  return (
    <AdminLayout title="Overview" subtitle="Platform-wide statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Restaurants"
          value={restaurants.data?.length ?? 0}
          icon={Store}
          loading={restaurants.isLoading}
          hint={`${activeRestaurants} active`}
        />
        <StatCard
          label="Menus"
          value={menus.data?.length ?? 0}
          icon={UtensilsCrossed}
          loading={menus.isLoading}
        />
        <StatCard
          label="Orders"
          value={orders.data?.length ?? 0}
          icon={ClipboardList}
          loading={orders.isLoading}
        />
        <StatCard
          label="Users"
          value={users.data?.length ?? 0}
          icon={Users}
          loading={users.isLoading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent restaurants</h3>
            <TrendingUp className="w-4 h-4 text-[hsl(var(--admin-accent))]" />
          </div>
          <ul className="space-y-3">
            {(restaurants.data ?? []).slice(0, 5).map((r) => (
              <li key={r._id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate">{r.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    r.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
            {!restaurants.isLoading && (restaurants.data ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">No restaurants yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent orders</h3>
            <TrendingUp className="w-4 h-4 text-[hsl(var(--admin-accent))]" />
          </div>
          <ul className="space-y-3">
            {(orders.data ?? []).slice(0, 5).map((o) => (
              <li key={o._id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate">
                  {o.order_number || o._id.slice(-6)}
                </span>
                <span className="text-muted-foreground">{o.status || "—"}</span>
              </li>
            ))}
            {!orders.isLoading && (orders.data ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">No orders yet.</li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
