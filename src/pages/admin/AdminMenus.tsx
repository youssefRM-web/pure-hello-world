import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminMenus } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function AdminMenus() {
  const { data, isLoading } = useAdminMenus();
  const [query, setQuery] = useState("");

  const filtered = (data ?? []).filter((m) =>
    (m.menu_name || m.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminLayout title="Menus" subtitle="All menus across the platform">
      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menus…"
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
                <th className="px-4 py-3 font-medium">Menu</th>
                <th className="px-4 py-3 font-medium">Restaurant</th>
                <th className="px-4 py-3 font-medium">Currency</th>
                <th className="px-4 py-3 font-medium">Categories</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--admin-border))]">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  </tr>
                ))}
              {!isLoading && filtered.map((m) => (
                <tr key={m._id} className="border-b border-[hsl(var(--admin-border))] hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {m.menu_name || m.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.restaurant_id ? m.restaurant_id.slice(-8) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.currency || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {Array.isArray(m.categories) ? m.categories.length : 0}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No menus found.
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
