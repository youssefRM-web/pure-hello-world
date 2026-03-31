import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            language === "en"
              ? "bg-[#0A2472] text-primary-foreground shadow-md"
              : "bg-card hover:bg-muted border border-border"
          }`}
        >
          <span className="text-lg">🇬🇧</span>
          <span className="text-sm font-medium hidden sm:inline">EN</span>
        </button>
        <button
          onClick={() => setLanguage("de")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            language === "de"
              ? "bg-[#0A2472] text-primary-foreground shadow-md"
              : "bg-card hover:bg-muted border border-border"
          }`}
        >
          <span className="text-lg">🇩🇪</span>
          <span className="text-sm font-medium hidden sm:inline">DE</span>
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative w-full max-w-4xl h-[600px] bg-card rounded-sm shadow-2xl overflow-hidden">
        {/* Animated Blue Panel */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-[#0A2472] z-20 flex flex-col items-center justify-center text-white p-8 transition-transform duration-700 ease-in-out ${
            isSignUp ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="text-center">
            {isSignUp ? (
              <>
                <h2 className="text-3xl font-bold mb-4">{t("welcomeBack")}</h2>
                <div className="mb-6">
                  <svg
                    className="w-12 h-12 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  </svg>
                </div>
                <p className="text-white/80 mb-8">{t("alreadyHaveAccount")}</p>
                <Button
                  variant="outline"
                  onClick={toggleMode}
                  className="border-white text-white bg-transparent hover:text-[#1a237e] transition-colors px-12 rounded-full"
                >
                  {t("signIn")}
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">{t("helloThere")}</h2>
                <div className="mb-6">
                  <svg
                    className="w-12 h-12 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="text-white/80 mb-8 max-w-xs">
                  {t("createRestaurantAccount")}
                </p>
                <Button
                  variant="outline"
                  onClick={toggleMode}
                  className="border-white text-white bg-transparent hover:text-[#1a237e] transition-colors px-12 rounded-full"
                >
                  {t("signUp")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`w-1/2 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
            isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              {t("welcomeBack")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t("signInToAccount")}
            </p>

            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t("email")}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder={t("enterYourEmail")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">{t("password")}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder={t("enterYourPassword")}
                  className="h-12"
                />
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  {t("forgotPassword")}
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#0A2472] hover:bg-[#0A2472]/90 text-white rounded-full font-medium transition-all duration-300"
              >
                {t("signIn")}
              </Button>
            </form>
          </div>
        </div>

        {/* Sign Up Form */}
        <div
          className={`w-1/2 flex flex-col items-center justify-center p-8 absolute right-0 top-0 h-full transition-opacity duration-500 ${
            isSignUp ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              {t("helloThere")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t("createYourAccount")}
            </p>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t("restaurantName")}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder={t("restaurantName")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-address">{t("address")}</Label>
                <Input
                  id="signup-address"
                  type="text"
                  placeholder={t("address")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">{t("contactEmail")}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder={t("contactEmail")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t("password")}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder={t("password")}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#0A2472] hover:bg-[#0A2472]/90 text-white rounded-full font-medium transition-all duration-300 mt-2"
              >
                {t("signUp")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="md:hidden w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col">
          {!isSignUp ? (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                {t("welcomeBack")}
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                {t("signInToAccount")}
              </p>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-signin-email">{t("email")}</Label>
                  <Input
                    id="mobile-signin-email"
                    type="email"
                    placeholder={t("enterYourEmail")}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile-signin-password">{t("password")}</Label>
                  <Input
                    id="mobile-signin-password"
                    type="password"
                    placeholder={t("enterYourPassword")}
                    className="h-12"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <a href="#" className="text-sm text-primary hover:underline">
                    {t("forgotPassword")}
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#1a237e] to-[#0d1442] text-white rounded-full"
                >
                  {t("signIn")}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground mb-3">
                  {t("dontHaveAccount")}
                </p>
                <Button
                  variant="outline"
                  onClick={toggleMode}
                  className="border-[#1a237e] text-[#1a237e] rounded-full px-8"
                >
                  {t("signUp")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                {t("helloThere")}
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                {t("createYourAccount")}
              </p>

              <form className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="mobile-signup-name">{t("restaurantName")}</Label>
                  <Input
                    id="mobile-signup-name"
                    type="text"
                    placeholder={t("restaurantName")}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile-signup-address">{t("address")}</Label>
                  <Input
                    id="mobile-signup-address"
                    type="text"
                    placeholder={t("address")}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile-signup-email">{t("contactEmail")}</Label>
                  <Input
                    id="mobile-signup-email"
                    type="email"
                    placeholder={t("contactEmail")}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile-signup-password">{t("password")}</Label>
                  <Input
                    id="mobile-signup-password"
                    type="password"
                    placeholder={t("password")}
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#1a237e] to-[#0d1442] text-white rounded-full mt-2"
                >
                  {t("signUp")}
                </Button>
              </form>

              <div className="mt-4 pt-4 border-t border-border text-center">
                <p className="text-muted-foreground mb-3">
                  {t("alreadyHaveAccount")}
                </p>
                <Button
                  variant="outline"
                  onClick={toggleMode}
                  className="border-[#1a237e] text-[#1a237e] rounded-full px-8"
                >
                  {t("signIn")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
