import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "AED"
): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: string = "en"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (locale === "ar") {
    return new Intl.DateTimeFormat("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: "light" | "dark" | "system") {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;

  if (theme === "system") {
    const systemTheme = getSystemTheme();
    root.classList.remove("light", "dark");
    root.classList.add(systemTheme);
  } else {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }
}

export function calculateServicePeriod(
  joiningDate: string,
  lastWorkingDay: string
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const start = new Date(joiningDate);
  const end = new Date(lastWorkingDay);

  const totalMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  let years = 0;
  let months = 0;
  let days = 0;

  let current = new Date(start);

  // Calculate years
  while (
    current.getFullYear() < end.getFullYear() ||
    (current.getFullYear() === end.getFullYear() &&
      current.getMonth() < end.getMonth()) ||
    (current.getFullYear() === end.getFullYear() &&
      current.getMonth() === end.getMonth() &&
      current.getDate() <= end.getDate())
  ) {
    const nextYear = new Date(current);
    nextYear.setFullYear(current.getFullYear() + 1);

    if (nextYear <= end) {
      years++;
      current = nextYear;
    } else {
      break;
    }
  }

  // Calculate months
  while (
    current.getMonth() < end.getMonth() ||
    (current.getMonth() === end.getMonth() &&
      current.getDate() <= end.getDate())
  ) {
    const nextMonth = new Date(current);
    nextMonth.setMonth(current.getMonth() + 1);

    if (nextMonth <= end) {
      months++;
      current = nextMonth;
    } else {
      break;
    }
  }

  // Calculate remaining days
  days = Math.floor(
    (end.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { years, months, days, totalDays };
}

// Fallback EOSB calculation when backend is not available
export function calculateEOSBFallback(
  basicSalary: number,
  terminationType: string,
  isUnlimitedContract: boolean,
  joiningDate: string,
  lastWorkingDay: string
) {
  const servicePeriod = calculateServicePeriod(joiningDate, lastWorkingDay);
  const totalSalary = basicSalary;

  // Check minimum service period (1 year for gratuity eligibility)
  if (servicePeriod.totalDays < 365) {
    return {
      totalServiceYears: servicePeriod.years,
      totalServiceMonths: servicePeriod.months,
      totalServiceDays: servicePeriod.days,
      basicSalaryAmount: basicSalary,
      totalSalary,
      eligibleYears: 0,
      gratuityAmount: 0,
      breakdown: {
        firstFiveYears: { years: 0, rate: 21, amount: 0 },
        additionalYears: { years: 0, rate: 30, amount: 0 },
      },
      isEligible: false,
      reason: "Minimum service period of 1 year not met",
    };
  }

  // Calculate gratuity based on UAE labor law
  const eligibleYears = servicePeriod.years;
  const firstFiveYears = Math.min(eligibleYears, 5);
  const additionalYears = Math.max(0, eligibleYears - 5);

  // Calculate amounts
  const firstFiveYearsAmount = (firstFiveYears * totalSalary * 21) / 365;
  const additionalYearsAmount = (additionalYears * totalSalary * 30) / 365;
  let gratuityAmount = firstFiveYearsAmount + additionalYearsAmount;

  // Apply resignation penalty if applicable
  if (terminationType === "resignation" && !isUnlimitedContract) {
    if (servicePeriod.totalDays < 365) {
      gratuityAmount = 0; // No gratuity for less than 1 year
    } else if (servicePeriod.totalDays < 1095) {
      // Less than 3 years
      gratuityAmount *= 0.33;
    } else if (servicePeriod.totalDays < 1826) {
      // Less than 5 years
      gratuityAmount *= 0.66;
    }
    // 5 years or more gets full amount (100%)
  }

  return {
    totalServiceYears: servicePeriod.years,
    totalServiceMonths: servicePeriod.months,
    totalServiceDays: servicePeriod.days,
    basicSalaryAmount: basicSalary,
    totalSalary,
    eligibleYears,
    gratuityAmount: Math.round(gratuityAmount),
    breakdown: {
      firstFiveYears: {
        years: firstFiveYears,
        rate: 21,
        amount: Math.round(firstFiveYearsAmount),
      },
      additionalYears: {
        years: additionalYears,
        rate: 30,
        amount: Math.round(additionalYearsAmount),
      },
    },
    isEligible: true,
  };
}
