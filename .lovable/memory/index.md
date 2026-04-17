# Memory: index.md
Updated: now

# Project Memory

## Core
Call2Food Backend: https://call2food.api.rmsoftware.de/api
Auth: JWT in localStorage, auto 401 redirects. AuthContext holds full restaurant profile + menu IDs.
Admin auth: separate AdminAuthContext with `admin_auth_token` key, mirrored to `auth_token` for apiRequest.
Localization: Bilingual (German/English) via centralized translation system.
Data Fetching: React Query for endpoints like /orders/{id}.

## Memories
- [API Integration](mem://api/integration) — Call2Food backend API connection and JWT auth handling
- [Auth Implementation](mem://auth/implementation) — Auth lifecycle, JWT persistence, and restaurant profile context
- [Registration Schema](mem://auth/registration-schema) — Required payload for /restaurants/signup endpoint
- [Localization](mem://features/localization) — German and English language support
- [Orders Management](mem://features/orders-management) — Order fetching, details, and status transitions
- [Menu Management](mem://features/menu-management) — Menu retrieval and editing structure tied to restaurant profile
- [Admin Panel](mem://admin/panel) — Separate /admin routes with distinct theme, restaurant/menu/order/user management
