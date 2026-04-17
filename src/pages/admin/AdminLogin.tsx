import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminLogin as adminLoginApi } from "@/lib/api/admin";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminLogin } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLoginApi({ email, password });
      adminLogin(res.access_token, res.admin);
      toast({ title: "Welcome back", description: "Signed in as admin." });
      navigate("/admin", { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-background))] p-4">
      <div className="w-full max-w-md bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--admin-accent))] flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-[hsl(var(--admin-accent-foreground))]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restricted area — administrators only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))] hover:bg-[hsl(var(--admin-accent))]/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
