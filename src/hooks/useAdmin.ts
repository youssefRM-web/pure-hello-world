import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminRestaurants,
  getAdminMenus,
  getAdminOrders,
  getAdminUsers,
  toggleAdminRestaurant,
} from "@/lib/api/admin";

export function useAdminRestaurants() {
  return useQuery({ queryKey: ["admin", "restaurants"], queryFn: getAdminRestaurants });
}

export function useAdminMenus() {
  return useQuery({ queryKey: ["admin", "menus"], queryFn: getAdminMenus });
}

export function useAdminOrders() {
  return useQuery({ queryKey: ["admin", "orders"], queryFn: getAdminOrders });
}

export function useAdminUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: getAdminUsers });
}

export function useToggleAdminRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleAdminRestaurant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "restaurants"] });
    },
  });
}
