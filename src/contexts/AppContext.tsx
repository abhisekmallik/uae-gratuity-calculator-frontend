"use client";

import { apiService } from "@/lib/api";
import { applyTheme } from "@/lib/utils";
import { AppContextType, ConfigurationData, Theme } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [config, setConfig] = useState<ConfigurationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Prevent browser extension hydration issues
  useEffect(() => {
    // Allow browser extensions to modify the DOM after hydration is complete
    const timer = setTimeout(() => {
      // Remove any suppressHydrationWarning attributes after hydration
      const elements = document.querySelectorAll("[suppresshydrationwarning]");
      elements.forEach((el) => {
        el.removeAttribute("suppresshydrationwarning");
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Fetch configuration on mount
  useEffect(() => {
    let mounted = true;

    const fetchConfig = async () => {
      try {
        // Don't fetch config if we're on the server error page to prevent redirect loops
        if (
          typeof window !== "undefined" &&
          window.location.pathname.includes("/server-error")
        ) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const configData = await apiService.getConfiguration();

        if (mounted) {
          setConfig(configData);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load configuration";
          setError(errorMessage);

          // Don't show toast for server down errors as they will redirect
          if (!errorMessage.includes("Server is currently unavailable")) {
            toast.error("Failed to load application configuration");
          }

          console.error("Failed to fetch configuration:", err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const contextValue: AppContextType = {
    theme,
    setTheme,
    config,
    isLoading,
    error,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
