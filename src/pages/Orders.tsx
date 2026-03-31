import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderDetails } from "@/components/orders/OrderDetails";

interface OrderItem {
  name: string;
  quantity: number;
  priceEach: number;
  total: number;
}

interface Order {
  id: number;
  customer: string;
  menu: string;
  date: string;
  price: string;
  status: "pending" | "completed" | "cancelled";
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
}

// Mock data for orders
const mockOrders: Order[] = [
  { 
    id: 1, 
    customer: "Sarah Johnson", 
    menu: "Burgers", 
    date: "Dec 29, 2024 at 2:45 PM", 
    price: "$50.44", 
    status: "pending",
    orderNumber: "#ORD-2024-1547",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, priceEach: 12.99, total: 25.98 },
      { name: "Classic Cheeseburger", quantity: 2, priceEach: 12.99, total: 25.98 },
      { name: "Classic Cheeseburger", quantity: 2, priceEach: 12.99, total: 25.98 },
    ],
    subtotal: 46.94,
    serviceFee: 3.50,
    totalAmount: 50.44
  },
  { 
    id: 2, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "pending",
    orderNumber: "#ORD-2024-1548",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
  { 
    id: 3, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "completed",
    orderNumber: "#ORD-2024-1549",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
  { 
    id: 4, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "pending",
    orderNumber: "#ORD-2024-1550",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
  { 
    id: 5, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "cancelled",
    orderNumber: "#ORD-2024-1551",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
  { 
    id: 6, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "pending",
    orderNumber: "#ORD-2024-1552",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
  { 
    id: 7, 
    customer: "Lukas Müller", 
    menu: "Burgers", 
    date: "22 Mai 2025, 12.21 PM", 
    price: "$10.00", 
    status: "pending",
    orderNumber: "#ORD-2024-1553",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, priceEach: 10.00, total: 10.00 },
    ],
    subtotal: 10.00,
    serviceFee: 0,
    totalAmount: 10.00
  },
];

const statusColors = {
  pending: "bg-warning/10 text-[#E19C34]",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};
const borderColors = {
  pending: " border-[#E19C34]",
  completed: " border-[#3CC34F]",
  cancelled: " border-[#F24040] ",
};

const Orders = () => {
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleGoBack = () => {
    setSelectedOrder(null);
  };

  // Show order details view
  if (selectedOrder) {
    return (
      <DashboardLayout>
        <OrderDetails
          order={{
            id: selectedOrder.id.toString(),
            orderNumber: selectedOrder.orderNumber,
            customerName: selectedOrder.customer,
            orderDate: selectedOrder.date,
            items: selectedOrder.items,
            subtotal: selectedOrder.subtotal,
            serviceFee: selectedOrder.serviceFee,
            totalAmount: selectedOrder.totalAmount,
          }}
          onGoBack={handleGoBack}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{t("ordersManagement")}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{t("ordersDescription")}</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("customer")}</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("menu")}</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("date")}</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("price")}</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("status")}</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b text-center border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="py-4 px-6 text-sm font-semibold text-foreground">{order.customer}</td>
                  <td className="py-4 px-6 text-sm text-foreground font-semibold">{order.menu}</td>
                  <td className="py-4 px-6 text-sm text-foreground font-semibold">{order.date}</td>
                  <td className="py-4 px-6 text-sm text-foreground font-semibold">{order.price}</td>
                  <td className="py-4 px-6">
                    <span
                      className={cn(
                        "px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs border font-medium whitespace-nowrap",
                        statusColors[order.status], borderColors[order.status]
                      )}
                    >
                      {t(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" className="bg-[#0A2472]  text-primary-foreground rounded-full hover:bg-[#0A2472]/90">
                          {t("accept")}
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("accept")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("decline")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {mockOrders.map((order) => (
            <div 
              key={order.id} 
              className="p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.menu}</p>
                </div>
                <Badge variant="outline" className={cn(
                  "font-normal",
                  statusColors[order.status],
                  borderColors[order.status]
                )}>
                  {t(order.status)}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{order.date}</span>
                <span className="font-medium text-foreground">{order.price}</span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      {t("accept")}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full">
                    <DropdownMenuItem>{t("accept")}</DropdownMenuItem>
                    <DropdownMenuItem>{t("decline")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
