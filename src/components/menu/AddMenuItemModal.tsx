import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuItem {
  itemName: string;
  description: string;
  ingredients: string;
  price: string;
  calories: string;
  portionSize: string;
}

interface Supplement {
  categoryName: string;
  itemName: string;
  price: string;
  description: string;
  ingredients: string;
  calories: string;
  portionSize: string;
  available: boolean;
}

interface AddMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

export function AddMenuItemModal({ open, onOpenChange, onSave }: AddMenuItemModalProps) {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState("USD ($)");
  const [menuName, setMenuName] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { itemName: "", description: "", ingredients: "", price: "", calories: "", portionSize: "" }
  ]);
  const [supplements, setSupplements] = useState<Supplement[]>([
    { categoryName: "", itemName: "", price: "", description: "", ingredients: "", calories: "", portionSize: "", available: true }
  ]);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerAvailable, setOfferAvailable] = useState(false);

  const handleAddItem = () => {
    setMenuItems([...menuItems, { itemName: "", description: "", ingredients: "", price: "", calories: "", portionSize: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index));
    }
  };

  const handleAddSupplement = () => {
    setSupplements([...supplements, { categoryName: "", itemName: "", price: "", description: "", ingredients: "", calories: "", portionSize: "", available: true }]);
  };

  const handleRemoveSupplement = (index: number) => {
    if (supplements.length > 1) {
      setSupplements(supplements.filter((_, i) => i !== index));
    }
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const updateSupplement = (index: number, field: keyof Supplement, value: string | boolean) => {
    const updated = [...supplements];
    (updated[index] as any)[field] = value;
    setSupplements(updated);
  };

  const handleSave = () => {
    onSave({
      currency,
      menuName,
      menuItems,
      supplements,
      offers: { title: offerTitle, description: offerDescription, available: offerAvailable }
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-lg font-bold text-foreground">{t("addMenu")}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* General Menu Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("generalMenuInfo")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t("currency")}</Label>
                <Input 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder="USD ($)"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("menuNameLabel")}</Label>
                <Input 
                  value={menuName} 
                  onChange={(e) => setMenuName(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder={t("menuNamePlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Menu Categories & Items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("menuCategoriesItems")}</h3>
            {menuItems.map((item, index) => (
              <div key={index} className="relative space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
                {menuItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("itemName")}</Label>
                    <Input 
                      value={item.itemName}
                      onChange={(e) => updateMenuItem(index, "itemName", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("itemNamePlaceholder")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("description")}</Label>
                    <Input 
                      value={item.description}
                      onChange={(e) => updateMenuItem(index, "description", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("descriptionPlaceholder")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("ingredients")}</Label>
                    <Input 
                      value={item.ingredients}
                      onChange={(e) => updateMenuItem(index, "ingredients", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("ingredientsPlaceholder")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("priceLabel")}</Label>
                    <Input 
                      value={item.price}
                      onChange={(e) => updateMenuItem(index, "price", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder="$ 0.01"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("calories")}</Label>
                    <Input 
                      value={item.calories}
                      onChange={(e) => updateMenuItem(index, "calories", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("caloriesPlaceholder")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("portionSize")}</Label>
                    <Input 
                      value={item.portionSize}
                      onChange={(e) => updateMenuItem(index, "portionSize", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("portionSizePlaceholder")}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button 
                type="button"
                size="sm"
                className="bg-[#0A2472] rounded-full hover:bg-[#0A2472]/90 text-white text-xs"
                onClick={handleAddItem}
              >
                <Plus className="w-3 h-3 mr-1" />
                {t("addItem")}
              </Button>
              <Button 
                type="button"
                size="sm"
                className="bg-[#0A2472] rounded-full hover:bg-[#0A2472]/90 text-white text-xs"
                onClick={handleAddItem}
              >
                <Plus className="w-3 h-3 mr-1" />
                {t("addCategory")}
              </Button>
            </div>
          </div>

          {/* Supplements */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("supplements")}</h3>
            {supplements.map((supp, index) => (
              <div key={index} className="relative space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
                {supplements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveSupplement(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("supplementCategoryName")}</Label>
                    <Input 
                      value={supp.categoryName}
                      onChange={(e) => updateSupplement(index, "categoryName", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("supplementCategoryPlaceholder")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("itemName")}</Label>
                    <Input 
                      value={supp.itemName}
                      onChange={(e) => updateSupplement(index, "itemName", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("supplementItemPlaceholder")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("priceLabel")}</Label>
                    <Input 
                      value={supp.price}
                      onChange={(e) => updateSupplement(index, "price", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder="$ 0.01"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("description")}</Label>
                    <Input 
                      value={supp.description}
                      onChange={(e) => updateSupplement(index, "description", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("descriptionPlaceholder")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("ingredients")}</Label>
                    <Input 
                      value={supp.ingredients}
                      onChange={(e) => updateSupplement(index, "ingredients", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("ingredientsPlaceholder")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("calories")}</Label>
                    <Input 
                      value={supp.calories}
                      onChange={(e) => updateSupplement(index, "calories", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("portionSize")}</Label>
                    <Input 
                      value={supp.portionSize}
                      onChange={(e) => updateSupplement(index, "portionSize", e.target.value)}
                      className="mt-1 text-sm"
                      placeholder={t("portionSizePlaceholder")}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <Label className="text-xs text-muted-foreground">{t("available")}</Label>
                    <Switch 
                      checked={supp.available}
                      onCheckedChange={(checked) => updateSupplement(index, "available", checked)}
                      className="data-[state=checked]:bg-[#0A2472]"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button 
              type="button"
              size="sm"
              className="bg-[#0A2472] rounded-full hover:bg-[#0A2472]/90 text-white text-xs"
              onClick={handleAddSupplement}
            >
              <Plus className="w-3 h-3 mr-1" />
              {t("addSupplementItem")}
            </Button>
          </div>

          {/* Offers & Promotions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("offersPromotions")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t("offerTitle")}</Label>
                <Input 
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder={t("offerTitlePlaceholder")}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("offerDescription")}</Label>
                <Input 
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder={t("offerDescriptionPlaceholder")}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Label className="text-xs text-muted-foreground">{t("available")}</Label>
              <Switch 
                checked={offerAvailable}
                onCheckedChange={setOfferAvailable}
                className="data-[state=checked]:bg-[#0A2472]"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-6 pt-4 border-t border-border shrink-0 bg-background">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-[#0A2472] rounded-full hover:bg-[#0A2472]/90 text-white text-sm"
              onClick={handleSave}
            >
              {t("save")}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-[#0A2472] rounded-full text-[#0A2472] hover:bg-[#0A2472]/10 text-sm"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}