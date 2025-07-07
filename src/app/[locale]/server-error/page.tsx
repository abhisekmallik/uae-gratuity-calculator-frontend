"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resetServerStatus } from "@/lib/api";
import { AlertTriangle, ArrowLeft, RefreshCw, Wifi } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServerErrorPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Try to fetch a simple endpoint to check if server is back online
      // We'll use the base API URL with a health check
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${baseUrl}/api/eosb/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Server is back online, reset status and redirect to home
        resetServerStatus();
        router.push("/");
      } else {
        // Still down, show toast message
        setTimeout(() => setIsRetrying(false), 2000);
      }
    } catch {
      // Still down
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  const handleGoHome = () => {
    // Reset server status when manually going home
    resetServerStatus();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-600 dark:text-red-400">
            {t("errors.serverDown.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("errors.serverDown.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Wifi className="w-4 h-4 mr-2" />
              {t("errors.serverDown.checkConnection")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("errors.serverDown.tryAgainLater")}
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("errors.serverDown.retrying")}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("errors.serverDown.retry")}
                </>
              )}
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("errors.serverDown.goHome")}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>{t("errors.serverDown.contactSupport")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
