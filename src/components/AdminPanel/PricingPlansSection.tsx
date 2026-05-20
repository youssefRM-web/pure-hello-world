import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import {
  useIndividualPlansQuery,
  type IndividualPlan,
} from "@/hooks/queries/useIndividualPlansQuery";
import CreateIndividualPlanModal from "./CreateIndividualPlanModal";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface PricingPlansSectionProps {
  customerId: string;
}

export default function PricingPlansSection({ customerId }: PricingPlansSectionProps) {
  const { data: plans = [], isLoading } = useIndividualPlansQuery(customerId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<IndividualPlan | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<IndividualPlan | null>(null);

  const handleToggleStatus = async (plan: IndividualPlan) => {
    setTogglingId(plan._id);
    try {
      const newIsActive = !plan.isActive;
      await apiService.patch(`/plans/individual/${plan._id}/status`, {
        isActive: newIsActive,
      });
      queryClient.invalidateQueries({ queryKey: ["individualPlans", customerId] });
      toast({
        title: `Plan ${newIsActive ? "activated" : "deactivated"}`,
        variant: "success" as any,
      });
    } catch (err: any) {
      toast({
        title: "Failed to update status",
        description: err?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
      setConfirmToggle(null);
    }
  };

  const canCreatePlan = plans.length < 2;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Pricing Plans</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage individual pricing plans for this customer. Max 2 plans.
          </p>
        </div>
        {canCreatePlan && (
          <Button onClick={() => setCreateModalOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No individual plans created yet. Click "Create Plan" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Actual Charge</TableHead>
                <TableHead>Max Buildings</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const currencySymbol = plan.currency === "EUR" ? "€" : plan.currency;
                const monthly = plan.monthlyDisplayPrice ?? plan.price;
                return (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                    <TableCell>{currencySymbol}{monthly}/month</TableCell>
                    <TableCell>
                      {plan.billingCycle === "yearly"
                        ? `${currencySymbol}${(monthly * 12).toLocaleString()}/year`
                        : `${currencySymbol}${monthly}/month`}
                    </TableCell>
                    <TableCell>{plan.maxBuildings}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {plan.createdAt ? format(new Date(plan.createdAt), "dd.MM.yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          plan.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {plan.purchasedAt && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Purchased
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditPlan(plan);
                          setCreateModalOpen(true);
                        }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmToggle(plan)}
                        disabled={togglingId === plan._id}
                        title={plan.isActive ? "Deactivate" : "Activate"}
                      >
                        {togglingId === plan._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : plan.isActive ? (
                          <ToggleRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateIndividualPlanModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditPlan(null);
        }}
        customerId={customerId}
        existingPlans={plans}
        editPlan={editPlan}
      />

      <AlertDialog
        open={!!confirmToggle}
        onOpenChange={(open) => !open && setConfirmToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmToggle?.isActive ? "Deactivate Plan?" : "Activate Plan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmToggle?.isActive
                ? "The customer will no longer see this plan in their subscription tab."
                : "The customer will immediately see this plan in their subscription tab."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmToggle && handleToggleStatus(confirmToggle)}
            >
              {confirmToggle?.isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
