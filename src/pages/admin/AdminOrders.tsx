import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminOrders } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const statusColor = (s?: string) => {
  switch ((s || "").toLowerCase()) {
    case "completed":
    case "delivered":
      return "bg-success/10 text-success";
    case "pending":
      return "bg-warning/10 text-warning";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AdminOrders() {
  const { data, isLoading } = useAdminOrders();
  const [query, setQuery] = useState("");

  const filtered = (data ?? []).filter((o) =>
    [o.order_number, o.customer_name, o.status, o._id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <AdminLayout title="Orders" subtitle="All orders across the platform">
      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders…"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filtered.length} / {data?.length ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-[hsl(var(--admin-border))]">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Restaurant</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--admin-border))]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    ))}
                  </tr>
                ))}
              {!isLoading && filtered.map((o) => (
                <tr key={o._id} className="border-b border-[hsl(var(--admin-border))] hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {o.order_number || o._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.customer_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.restaurant_id ? o.restaurant_id.slice(-8) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {typeof o.total === "number" ? `€${o.total.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(o.status)}`}>
                      {o.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
