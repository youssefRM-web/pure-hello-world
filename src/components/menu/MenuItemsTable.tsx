import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/hooks/useMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";

export function MenuItemsTable() {
  const { t } = useLanguage();
  const { restaurant } = useAuth();
  const menuId = restaurant?.menus?.[0];
  const { data: menuData, isLoading, error } = useMenu(menuId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
        {(error as Error).message}
      </div>
    );
  }

  const allItems = menuData?.menus?.flatMap(cat =>
    cat.items.map(item => ({ ...item, category: cat.category_name }))
  ) ?? [];

  if (allItems.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
        {t("noMenuItems")}
      </div>
    );
  }

  const currency = menuData?.currency === "TND" ? "TND " : menuData?.currency === "EUR" ? "€" : "$";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {menuData && (
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{menuData.menu_name}</h3>
          <p className="text-sm text-muted-foreground">{t("currency")}: {menuData.currency}</p>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("category")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("itemName")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("description")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("price")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("availability")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((item, idx) => (
              <tr key={idx} className="text-center border-b border-border last:border-b-0">
                <td className="py-4 px-6 text-sm text-muted-foreground">{item.category}</td>
                <td className="py-4 px-6 text-sm font-semibold text-foreground">{item.item_name || "-"}</td>
                <td className="py-4 px-6 text-sm text-foreground">{item.description || "-"}</td>
                <td className="py-4 px-6 text-sm text-foreground font-semibold">
                  {currency}{(item.price ?? 0).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <Checkbox
                    checked={item.available !== false}
                    className="border-[#0A2472] rounded-none data-[state=checked]:bg-[#0A2472]"
                  />
                </td>
                <td className="py-4 px-6">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-2 h-auto"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {allItems.map((item, idx) => (
          <div key={idx} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{item.item_name || "-"}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description || "-"}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">{currency}{(item.price ?? 0).toFixed(2)}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox checked={item.available !== false} className="border-primary data-[state=checked]:bg-primary" />
                  <span className="text-sm text-muted-foreground">{t("available")}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-2 h-auto"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
