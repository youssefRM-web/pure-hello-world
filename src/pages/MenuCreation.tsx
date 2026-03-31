import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Pencil, ScanLine, ArrowLeft, Pencil as EditIcon, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddMenuItemModal } from "@/components/menu/AddMenuItemModal";
import { MenuUploadView } from "@/components/menu/MenuUploadView";

interface MenuItem {
  id: string;
  photo: string | null;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const MenuCreation = () => {
  const { t } = useLanguage();
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "2", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "3", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "4", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "5", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "6", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
    { id: "7", photo: null, name: "Burgers", description: "Extra Cheese With Sauce", price: 10.00, available: true },
  ]);

  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveMenuItem = (data: any) => {
    console.log("Saved menu item:", data);
    // Handle saving the new menu item
  };

  // Show Upload Menu View
  if (showUploadMenu) {
    return (
      <DashboardLayout>
        <MenuUploadView onGoBack={() => setShowUploadMenu(false)} />
      </DashboardLayout>
    );
  }

  if (showManualEntry) {
    return (
      <DashboardLayout>
        {/* Header with Go Back */}
        <div className="mb-4 sm:mb-8">
          <Button 
            variant="ghost" 
            className="mb-2 sm:mb-4 text-[#0A2472] hover:text-[#0A2472]/80 p-0 h-auto text-sm"
            onClick={() => setShowManualEntry(false)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("goBack")}
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">{t("createYourMenuManual")}</h1>
              <p className="text-xs sm:text-sm text-[#181522] mt-1">{t("createMenuWithManualEntry")}</p>
            </div>
            <Button 
              className="bg-[#0A2472] rounded-full hover:bg-[#0A2472]/90 text-white text-xs sm:text-sm w-fit"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("addNewItem")}</span>
            </Button>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-center font-semibold text-foreground text-xs">{t("photo")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs">{t("itemName")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs hidden sm:table-cell">{t("description")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs">{t("price")}</TableHead>
                <TableHead className="text-center font-semibold text-foreground text-xs">{t("availability")}</TableHead>
                <TableHead className="text-center font-semibold text-foreground text-xs">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id} className="border-b border-border">
                  <TableCell className="text-center p-2 sm:p-4">
                    {item.photo ? (
                      <img 
                        src={item.photo} 
                        alt={item.name} 
                        className="w-12 h-10 sm:w-16 sm:h-12 object-cover rounded mx-auto"
                      />
                    ) : (
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {t("noPhotoAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground text-xs sm:text-sm p-2 sm:p-4">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell p-2 sm:p-4">{item.description}</TableCell>
                  <TableCell className="text-foreground text-xs sm:text-sm p-2 sm:p-4">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center p-2 sm:p-4">
                    <Switch 
                      checked={item.available} 
                      onCheckedChange={() => handleToggleAvailability(item.id)}
                      className="data-[state=checked]:bg-[#0A2472]"
                    />
                  </TableCell>
                  <TableCell className="p-2 sm:p-4">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 sm:h-8 sm:w-8 border-[#0A2472] text-[#0A2472] hover:bg-[#0A2472]/10"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 sm:h-8 sm:w-8 border-red-500 text-white bg-red-500 hover:bg-red-600"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AddMenuItemModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal}
          onSave={handleSaveMenuItem}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("createYourMenu")}</h1>
        <p className="text-sm text-[#181522] mt-1">{t("chooseBestOption")}</p>
      </div>
      
      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-full">
        {/* Manual Entry Card */}
        <div className="bg-card rounded-xl border border-border p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0A2472] flex items-center justify-center mb-4 sm:mb-6">
            <Pencil className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t("manualEntry")}</h2>
          <p className="text-xs sm:text-sm text-[#181522] mb-4 sm:mb-6 max-w-xs">
            {t("manualEntryDesc")}
          </p>
          <Button 
            className="w-full rounded-full max-w-[200px] bg-[#0A2472] hover:bg-[#0A2472]/90 text-primary-foreground text-sm"
            onClick={() => setShowManualEntry(true)}
          >
            {t("startManualEntry")}
          </Button>
        </div>

        {/* AI Menu Scan Card */}
        <div className="bg-card rounded-xl border border-border p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0A2472] flex items-center justify-center mb-4 sm:mb-6">
            <ScanLine className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t("aiMenuScan")}</h2>
          <p className="text-xs sm:text-sm text-[#181522] mb-4 sm:mb-6 max-w-xs">
            {t("aiMenuScanDesc")}
          </p>
          <Button 
            className="w-full rounded-full max-w-[200px] bg-[#0A2472] hover:bg-[#0A2472]/90 text-primary-foreground text-sm"
            onClick={() => setShowUploadMenu(true)}
          >
            {t("uploadMenu")}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuCreation;
