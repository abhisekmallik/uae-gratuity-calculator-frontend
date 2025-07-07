"use client";

import { ClientOnly } from "@/components/ClientOnly";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname } from "@/i18n/routing";
import { Languages, Monitor, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export function Header() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { theme, setTheme } = useAppContext();
  const pathname = usePathname();

  // Check if language switcher should be shown
  const showLanguageSwitcher =
    process.env.NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER === "true";

  const themes = [
    { value: "light", label: t("themes.light"), icon: Sun },
    { value: "dark", label: t("themes.dark"), icon: Moon },
    { value: "system", label: t("themes.system"), icon: Monitor },
  ] as const;

  const languages = [
    { value: "en", label: "English", dir: "ltr" },
    { value: "ar", label: "العربية", dir: "rtl" },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);
  const ThemeIcon = currentTheme?.icon || Monitor;

  const handleLanguageChange = (newLocale: "en" | "ar") => {
    if (newLocale !== currentLocale) {
      // Force a full page reload to ensure proper locale switching
      const newUrl = `/${newLocale}${pathname === "/" ? "" : pathname}`;
      window.location.href = newUrl;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between header-container">
          {/* Logo and Title - will be on right in RTL */}
          <div className="flex items-center gap-3 header-logo">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
              <Image
                src="/uae-eosb-gratuity-calculator.svg"
                alt="UAE EOSB Gratuity Calculator"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">{t("app.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("app.subtitle")}
              </p>
            </div>
          </div>

          {/* Controls - will be on left in RTL */}
          <div className="flex items-center gap-3 header-controls">
            {/* Language Selector - conditionally rendered */}
            {showLanguageSwitcher && (
              <ClientOnly>
                <Select
                  value={currentLocale}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" suppressHydrationWarning />
                      <span className="truncate">
                        {currentLocale === "ar" ? "العربية" : "English"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span
                          className={
                            currentLocale === lang.value ? "font-semibold" : ""
                          }
                        >
                          {lang.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ClientOnly>
            )}

            {/* Theme Selector */}
            <ClientOnly>
              <Select
                value={theme}
                onValueChange={(value: "light" | "dark" | "system") =>
                  setTheme(value)
                }
              >
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <ThemeIcon className="h-4 w-4" suppressHydrationWarning />
                    <span>{currentTheme?.label}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <SelectItem
                        key={themeOption.value}
                        value={themeOption.value}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" suppressHydrationWarning />
                          <span>{themeOption.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>
  );
}
