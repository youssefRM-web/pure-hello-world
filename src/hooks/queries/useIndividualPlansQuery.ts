import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export interface IndividualPlan {
  _id: string;
  organization: string;
  name: string;
  nameKey?: string;
  description?: string;
  planDescription?: string;
  planName?: string;
  descriptionKey?: string;
  billingCycle: "monthly" | "yearly";
  billingTextKey?: string;
  currency: string;
  price: number;
  monthlyDisplayPrice: number;
  maxBuildings: number;
  maxUsers?: number;
  maxAssets?: number;
  isActive: boolean;
  trialDays?: number;
  featuresKeys?: string[];
  hasAnalytics?: boolean;
  hasAdvancedSupport?: boolean;
  has24_7Support?: boolean;
  createdAt: string;
  updatedAt?: string;
  purchasedAt?: string;
  mollieSubscriptionId?: string;
  nextBillingDate?: string;
}

/**
 * Fetch individual plans assigned to a specific organization
 * (used by both Super Admin and Customer's SubscriptionTab)
 */
export const useIndividualPlansQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: ["individualPlans", organizationId],
    queryFn: async () => {
      const response = await apiService.get<IndividualPlan[]>(
        `/plans/organization/${organizationId}`
      );
      return response.data;
    },
    enabled: !!organizationId,
  });
};

/**
 * Alias for customer-side usage
 */
export const useMyIndividualPlansQuery = useIndividualPlansQuery;
