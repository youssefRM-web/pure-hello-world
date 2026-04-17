---
name: Admin Panel
description: Separate /admin/* routes, distinct theme, admin JWT auth, restaurants/menus/orders/users management
type: feature
---
Admin panel lives at /admin/* with its own AdminAuthProvider (separate JWT key `admin_auth_token`, mirrored to `auth_token` so apiRequest sends bearer header).

Routes:
- /admin/login → AdminLogin (POST /admin/login)
- /admin → AdminOverview (KPI cards: restaurants, menus, orders, users)
- /admin/restaurants → list + toggle active (PATCH /admin/restaurants/{id}/toggle)
- /admin/menus → GET /admin/menus
- /admin/orders → GET /admin/orders
- /admin/users → GET /admin/users

Theme: distinct dark navy sidebar (--admin-sidebar 222 47% 13%) with cyan accent (--admin-accent 199 89% 48%) — visually separates admin context from restaurant dashboard.

Components: AdminLayout (sidebar + header), AdminSidebar, AdminProtectedRoute. Hooks in src/hooks/useAdmin.ts. API in src/lib/api/admin.ts.
