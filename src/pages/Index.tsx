import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { OrdersOverview } from "@/components/dashboard/OrdersOverview";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MostOrdered } from "@/components/dashboard/MostOrdered";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  const kpiData = [
    { titleKey: "menusToday", value: 350, percentage: 70, color: "blue" as const },
    { titleKey: "ordersPending", value: 310, percentage: 70, color: "red" as const },
    { titleKey: "ordersCompleted", value: 300, percentage: 70, color: "green" as const },
    { titleKey: "newCustomers", value: 400, percentage: 30, color: "dark" as const },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{t("dashboard")}</h1>
        <p className="text-sm md:text-base text-[#181522]">{t("welcomeBack")}</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {kpiData.map((kpi) => (
          <KPICard
            key={kpi.titleKey}
            title={t(kpi.titleKey)}
            value={kpi.value}
            percentage={kpi.percentage}
            color={kpi.color}
          />
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <OrdersOverview />
        <RevenueChart />
      </div>
      
      {/* Most Ordered */}
      <MostOrdered />
    </DashboardLayout>
  );
};

export default Index;
