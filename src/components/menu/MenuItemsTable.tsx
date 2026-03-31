import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import pizzaMargherita from "@/assets/pizza-margherita.png";

interface MenuItem {
  id: number;
  photo: string;
  name: string;
  description: string;
  price: string;
  available: boolean;
}

const mockMenuItems: MenuItem[] = [
  { id: 1, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 2, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 3, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 4, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 5, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 6, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
  { id: 7, photo: pizzaMargherita, name: "Burgers", description: "Extra Cheese With Sauce", price: "$10.00", available: true },
];

export function MenuItemsTable() {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("photo")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("itemName")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("description")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("price")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("availability")}</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {mockMenuItems.map((item) => (
              <tr key={item.id} className=" text-center border-b border-border last:border-b-0">
                <td className="py-4 px-6 flex justify-center">
                  <img 
                    src={item.photo} 
                    alt={item.name} 
                    className="w-16 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-foreground">{item.name}</td>
                <td className="py-4 px-6 text-sm text-foreground">{item.description}</td>
                <td className="py-4 px-6 text-sm text-foreground font-semibold">{item.price}</td>
                <td className="py-4 px-6">
                  <Checkbox checked={item.available} className="border-[#0A2472] rounded-none data-[state=checked]:bg-[#0A2472]" />
                </td>
                <td className="py-4 px-6">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-2 h-auto"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {mockMenuItems.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <img 
                src={item.photo} 
                alt={item.name} 
                className="w-16 h-12 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">{item.price}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox checked={item.available} className="border-primary data-[state=checked]:bg-primary" />
                  <span className="text-sm text-muted-foreground">{t("available")}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-2 h-auto"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
