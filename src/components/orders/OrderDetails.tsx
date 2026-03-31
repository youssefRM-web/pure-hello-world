import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  priceEach: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
}

interface OrderDetailsProps {
  order: Order;
  onGoBack: () => void;
}

export function OrderDetails({ order, onGoBack }: OrderDetailsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onGoBack}
        className=" text-[#0A2472] hover:text-[#0A2472]/80 p-0 h-auto text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("goBack")}
      </Button>

      <div className="bg-card rounded-xl border border-border p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{t("orderDetails")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("ordersDescription")}</p>
        </div>

        {/* Order Information */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">{t("orderInformation")}</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("orderNumber")}</span>
              <span className="text-sm font-medium text-foreground">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("customerName")}</span>
              <span className="text-sm font-medium text-foreground">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("orderDateTime")}</span>
              <span className="text-sm font-medium text-foreground">{order.orderDate}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Ordered Items */}
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">{t("orderedItems")}</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("qty")}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${item.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">${item.priceEach.toFixed(2)} {t("each")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">{t("summary")}</h2>
            <div className="space-y-2 bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
                <span className="text-sm font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("serviceFee")}</span>
                <span className="text-sm font-medium text-foreground">${order.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-medium text-amber-600">{t("totalAmount")}</span>
                <span className="text-sm font-semibold text-foreground">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
