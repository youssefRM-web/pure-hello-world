import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminRestaurants, useToggleAdminRestaurant } from "@/hooks/useAdmin";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

export default function AdminRestaurants() {
  const { data, isLoading } = useAdminRestaurants();
  const toggle = useToggleAdminRestaurant();
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const filtered = (data ?? []).filter((r) =>
    [r.name, r.email, r.phone].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const handleToggle = async (id: string, name: string) => {
    try {
      await toggle.mutateAsync(id);
      toast({ title: "Updated", description: `${name} status updated.` });
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Could not toggle",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Restaurants" subtitle="Manage every restaurant on the platform">
      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants…"
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Active</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--admin-border))]">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-10 ml-auto" /></td>
                  </tr>
                ))}
              {!isLoading && filtered.map((r) => (
                <tr key={r._id} className="border-b border-[hsl(var(--admin-border))] hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        r.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Switch
                      checked={r.status === "active"}
                      onCheckedChange={() => handleToggle(r._id, r.name)}
                      disabled={toggle.isPending}
                    />
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No restaurants found.
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
