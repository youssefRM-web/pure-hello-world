import { useQuery } from "@tanstack/react-query";
import { getMenu, type MenuData } from "@/lib/api";

export function useMenu(menuId: string | undefined) {
  return useQuery<MenuData>({
    queryKey: ["menu", menuId],
    queryFn: () => getMenu(menuId!),
    enabled: !!menuId,
  });
}
