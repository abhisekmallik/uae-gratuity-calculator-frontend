"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building, Heart, Scale, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-16 border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* About Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5" suppressHydrationWarning />
                {t("about.title")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("about.description")}
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">
                    {t("about.formula.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("about.formula.description")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">
                    {t("about.rules.title")}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("about.rules.firstFive")}</li>
                    <li>• {t("about.rules.afterFive")}</li>
                    <li>• {t("about.rules.minimum")}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Penalties Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" suppressHydrationWarning />
                {t("about.penalties.title")}
              </h3>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  {t("about.penalties.lessThanOne")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  {t("about.penalties.oneToThree")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  {t("about.penalties.threeToFive")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  {t("about.penalties.fiveOrMore")}
                </li>
              </ul>

              <div className="mt-6 p-4 bg-slate-800 dark:bg-slate-700 rounded-lg border-2 border-slate-700 dark:border-slate-600">
                <p className="text-sm text-white dark:text-slate-100 flex items-center gap-2 font-medium">
                  <Shield
                    className="h-4 w-4 flex-shrink-0"
                    suppressHydrationWarning
                  />
                  {t("footer.disclaimer")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with{" "}
            <Heart
              className="h-4 w-4 text-red-500 flex-shrink-0"
              suppressHydrationWarning
            />{" "}
            for UAE employees
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Abhisek Mallik - UAE Gratuity
            Calculator. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
