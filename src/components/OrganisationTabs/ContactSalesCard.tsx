import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactSales } from "@/components/contact-sales-provider";

interface ContactSalesCardProps {
  /** When true, renders an "expired" headline & alert styling */
  isExpired?: boolean;
}

/**
 * ContactSalesCard
 * ----------------
 * Mirrors the homepage enterprise pricing card. Shown inside the Subscription
 * tab when the user has no individual plan assigned and either:
 *   - has no active subscription, or
 *   - their trial has expired
 */
const ContactSalesCard: React.FC<ContactSalesCardProps> = ({ isExpired = false }) => {
  const { language, t } = useLanguage();
  const { openContactSales } = useContactSales();

  const features =
    language === "de"
      ? [
          "Unbegrenzte Nutzerzugänge",
          "Alle erweiterten Plattformfunktionen",
          "Analyse-Dashboard",
          "Mobiles Reporting",
          "Mobile App (iOS & Android)",
          "Priorisierter Support",
        ]
      : [
          "Unlimited user access",
          "All advanced platform features",
          "Analytics dashboard",
          "Mobile reporting",
          "Mobile app (iOS & Android)",
          "Priority support",
        ];

  const headline =
    language === "de" ? "Lass uns reden!" : "Let's talk!";
  const subline =
    language === "de"
      ? "Wählen Sie den passenden Tarif und machen Sie Ihr Facility Management nahtlos effizient."
      : "Choose the right plan and make your facility management seamlessly efficient.";

  const expiredTitle =
    language === "de" ? "Ihre Testphase ist abgelaufen" : "Your trial has expired";
  const expiredDesc =
    language === "de"
      ? "Kontaktieren Sie unser Vertriebsteam, um einen für Ihre Organisation passenden Tarif zu erhalten."
      : "Get in touch with our sales team to receive a plan tailored to your organization.";
  const noPlanTitle =
    language === "de" ? "Kein Tarif aktiv" : "No active plan";
  const noPlanDesc =
    language === "de"
      ? "Sie haben derzeit keinen Tarif. Kontaktieren Sie unser Vertriebsteam, um einen individuellen Tarif für Ihre Organisation zu erstellen."
      : "You currently have no plan. Contact our sales team to set up an individual plan for your organization.";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Status banner */}
      <div
        className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
          isExpired
            ? "bg-destructive/10 border-destructive/20"
            : "bg-primary/5 border-primary/20"
        }`}
      >
        <AlertCircle
          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
            isExpired ? "text-destructive" : "text-primary"
          }`}
        />
        <div>
          <h3
            className={`font-semibold mb-1 ${
              isExpired ? "text-destructive" : "text-foreground"
            }`}
          >
            {isExpired ? expiredTitle : noPlanTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isExpired ? expiredDesc : noPlanDesc}
          </p>
        </div>
      </div>

      <div className="text-center mb-8">
        {/* <Badge className="bg-transparent text-primary border-primary mb-4">
          <CreditCard className="w-4 h-4 mr-2" />
          {language === "de" ? "UNSER TARIF" : "OUR PLAN"}
        </Badge> */}
        <p className="text-base text-muted-foreground">{subline}</p>
      </div>

      <Card className="relative border border-primary shadow-lg shadow-primary/20 bg-gradient-to-b from-[hsl(220,70%,12%)] to-[hsl(220,55%,32%)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            {headline}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col flex-1">
          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center text-white">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="mt-auto w-full py-3 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
            onClick={openContactSales}
          >
            {t("organisation.contactSales") ||
              (language === "de" ? "Vertrieb kontaktieren" : "Contact Sales")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSalesCard;
