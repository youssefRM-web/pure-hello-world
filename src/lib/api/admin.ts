import { apiRequest } from "./client";

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  admin?: Record<string, unknown>;
}

export interface AdminRestaurant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  foodType?: string[];
  address?: { line1?: string };
  created_at?: string;
}

export interface AdminMenu {
  _id: string;
  menu_name?: string;
  name?: string;
  restaurant_id?: string;
  currency?: string;
  categories?: unknown[];
  created_at?: string;
}

export interface AdminOrder {
  _id: string;
  order_number?: string;
  restaurant_id?: string;
  customer_name?: string;
  total?: number;
  status?: string;
  created_at?: string;
}

export interface AdminUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export function adminLogin(credentials: AdminLoginCredentials): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getAdminRestaurants(): Promise<AdminRestaurant[]> {
  return apiRequest<AdminRestaurant[]>("/admin/restaurants");
}

export function toggleAdminRestaurant(id: string): Promise<AdminRestaurant> {
  return apiRequest<AdminRestaurant>(`/admin/restaurants/${id}/toggle`, {
    method: "PATCH",
  });
}

export function getAdminMenus(): Promise<AdminMenu[]> {
  return apiRequest<AdminMenu[]>("/admin/menus");
}

export function getAdminOrders(): Promise<AdminOrder[]> {
  return apiRequest<AdminOrder[]>("/admin/orders");
}

export function getAdminUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>("/admin/users");
}
