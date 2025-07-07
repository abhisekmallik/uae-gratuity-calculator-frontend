"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { apiService } from "@/lib/api";
import { EmployeeData, EOSBCalculationResult } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calculator, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

export function GratuityCalculator() {
  const t = useTranslations();
  const locale = useLocale();
  const { config } = useAppContext();
  const [formData, setFormData] = useState<Partial<EmployeeData>>({
    basicSalary: 0,
    terminationType: undefined,
    isUnlimitedContract: true,
    joiningDate: "",
    lastWorkingDay: "",
  });
  const [result, setResult] = useState<EOSBCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.basicSalary || formData.basicSalary <= 0) {
      newErrors.basicSalary = t("errors.invalidAmount");
    }

    if (!formData.terminationType) {
      newErrors.terminationType = t("errors.required");
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = t("errors.required");
    } else {
      const joining = new Date(formData.joiningDate);
      if (joining > new Date()) {
        newErrors.joiningDate = t("errors.joiningDateFuture");
      }
    }

    if (!formData.lastWorkingDay) {
      newErrors.lastWorkingDay = t("errors.required");
    } else if (formData.joiningDate) {
      const joining = new Date(formData.joiningDate);
      const lastDay = new Date(formData.lastWorkingDay);
      if (lastDay <= joining) {
        newErrors.lastWorkingDay = t("errors.lastWorkingDayBeforeJoining");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);
    setResult(null);

    try {
      const employeeData: EmployeeData = {
        basicSalary: formData.basicSalary!,
        terminationType: formData.terminationType!,
        isUnlimitedContract: formData.isUnlimitedContract!,
        joiningDate: formData.joiningDate!,
        lastWorkingDay: formData.lastWorkingDay!,
      };

      try {
        // Use the backend API only
        const calculationResult = await apiService.calculateEOSB(employeeData);
        setResult(calculationResult);

        // Show success toast
        toast.success(t("calculation.success"));
      } catch (error) {
        console.error("API calculation failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : t("errors.calculationError");
        setErrors({ general: errorMessage });

        // Toast is already handled by the API service, so no need for additional toast here
      }
    } catch (error) {
      console.error("Calculation error:", error);
      setErrors({ general: t("errors.calculationError") });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClear = () => {
    setFormData({
      basicSalary: 0,
      terminationType: undefined,
      isUnlimitedContract: true,
      joiningDate: "",
      lastWorkingDay: "",
    });
    setResult(null);
    setErrors({});
  };

  const handleInputChange = (
    field: keyof EmployeeData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2
            className="h-8 w-8 animate-spin mx-auto mb-4"
            suppressHydrationWarning
          />
          <p className="text-muted-foreground">{t("loading.configuration")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 rtl:flex-row-reverse">
            {/* <Calculator className="h-6 w-6" suppressHydrationWarning /> */}
            {t("form.title")}
          </CardTitle>
          <CardDescription>{t("form.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Salary */}
          <div className="space-y-2">
            <Label htmlFor="basicSalary">{t("form.basicSalary.label")}</Label>
            <Input
              id="basicSalary"
              type="number"
              min="0"
              placeholder={t("form.basicSalary.placeholder")}
              value={formData.basicSalary || ""}
              onChange={(e) =>
                handleInputChange("basicSalary", Number(e.target.value))
              }
              className={errors.basicSalary ? "border-red-500" : ""}
            />
            {errors.basicSalary && (
              <p className="text-sm text-red-500 flex items-center gap-1 rtl:flex-row-reverse">
                <AlertCircle className="h-4 w-4" suppressHydrationWarning />
                {errors.basicSalary}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t("form.basicSalary.description")}
            </p>
          </div>

          {/* Termination Type */}
          <div className="space-y-2">
            <Label htmlFor="terminationType">
              {t("form.terminationType.label")}
            </Label>
            <Select
              value={formData.terminationType}
              onValueChange={(value) =>
                handleInputChange("terminationType", value)
              }
            >
              <SelectTrigger
                className={errors.terminationType ? "border-red-500" : ""}
              >
                <SelectValue
                  placeholder={t("form.terminationType.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {config.terminationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {locale === "ar" ? type.labelAr : type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.terminationType && (
              <p className="text-sm text-red-500 flex items-center gap-1 rtl:flex-row-reverse">
                <AlertCircle className="h-4 w-4" suppressHydrationWarning />
                {errors.terminationType}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t("form.terminationType.description")}
            </p>
          </div>

          {/* Contract Type */}
          <div className="space-y-2">
            <Label htmlFor="contractType">{t("form.contractType.label")}</Label>
            <Select
              value={formData.isUnlimitedContract?.toString()}
              onValueChange={(value) =>
                handleInputChange("isUnlimitedContract", value === "true")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("form.contractType.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {config.contractTypes.map((type) => (
                  <SelectItem
                    key={type.value.toString()}
                    value={type.value.toString()}
                  >
                    {locale === "ar" ? type.labelAr : type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t("form.contractType.description")}
            </p>
          </div>

          {/* Joining Date */}
          <div className="space-y-2">
            <Label htmlFor="joiningDate">{t("form.joiningDate.label")}</Label>
            <Input
              id="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => handleInputChange("joiningDate", e.target.value)}
              className={errors.joiningDate ? "border-red-500" : ""}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.joiningDate && (
              <p className="text-sm text-red-500 flex items-center gap-1 rtl:flex-row-reverse">
                <AlertCircle className="h-4 w-4" suppressHydrationWarning />
                {errors.joiningDate}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t("form.joiningDate.description")}
            </p>
          </div>

          {/* Last Working Day */}
          <div className="space-y-2">
            <Label htmlFor="lastWorkingDay">
              {t("form.lastWorkingDay.label")}
            </Label>
            <Input
              id="lastWorkingDay"
              type="date"
              value={formData.lastWorkingDay}
              onChange={(e) =>
                handleInputChange("lastWorkingDay", e.target.value)
              }
              className={errors.lastWorkingDay ? "border-red-500" : ""}
              min={formData.joiningDate || undefined}
            />
            {errors.lastWorkingDay && (
              <p className="text-sm text-red-500 flex items-center gap-1 rtl:flex-row-reverse">
                <AlertCircle className="h-4 w-4" suppressHydrationWarning />
                {errors.lastWorkingDay}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t("form.lastWorkingDay.description")}
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2 rtl:flex-row-reverse">
                <AlertCircle className="h-4 w-4" suppressHydrationWarning />
                {errors.general}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 rtl:flex-row-reverse rtl:justify-start">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isCalculating ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin mr-2 rtl:ml-2 rtl:mr-0"
                    suppressHydrationWarning
                  />
                  {t("form.calculating")}
                </>
              ) : (
                <>
                  <Calculator
                    className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0"
                    suppressHydrationWarning
                  />
                  {t("form.calculate")}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              {t("form.clear")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsCard({ result }: { result: EOSBCalculationResult }) {
  const t = useTranslations();
  const locale = useLocale();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 rtl:flex-row-reverse ${
            result.isEligible
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {result.isEligible ? "✅" : "❌"}
          {result.isEligible ? t("results.eligible") : t("results.notEligible")}
        </CardTitle>
        {result.reason && (
          <CardDescription className="text-red-600 dark:text-red-400">
            {result.reason}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {result.isEligible && (
          <>
            {/* Total Amount */}
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                {t("results.totalAmount")}
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.gratuityAmount)}
              </p>
            </div>

            {/* Service Period */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.totalServiceYears}</p>
                <p className="text-sm text-muted-foreground">
                  {t("results.years")}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {result.totalServiceMonths}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("results.months")}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.totalServiceDays}</p>
                <p className="text-sm text-muted-foreground">
                  {t("results.days")}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("results.breakdown")}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg rtl:flex-row-reverse">
                  <span>{t("results.firstFiveYears")}</span>
                  <span className="font-semibold">
                    {result.breakdown.firstFiveYears.years} {t("results.years")}{" "}
                    × {result.breakdown.firstFiveYears.rate}{" "}
                    {t("results.daysPerYear")} ={" "}
                    {formatCurrency(result.breakdown.firstFiveYears.amount)}
                  </span>
                </div>

                {result.breakdown.additionalYears.years > 0 && (
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg rtl:flex-row-reverse">
                    <span>{t("results.additionalYears")}</span>
                    <span className="font-semibold">
                      {result.breakdown.additionalYears.years}{" "}
                      {t("results.years")} ×{" "}
                      {result.breakdown.additionalYears.rate}{" "}
                      {t("results.daysPerYear")} ={" "}
                      {formatCurrency(result.breakdown.additionalYears.amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between rtl:flex-row-reverse">
                  <span className="text-muted-foreground">
                    {t("results.summary.basicSalary")}
                  </span>
                  <span>{formatCurrency(result.basicSalaryAmount)}</span>
                </div>
                <div className="flex justify-between rtl:flex-row-reverse">
                  <span className="text-muted-foreground">
                    {t("results.summary.totalSalary")}
                  </span>
                  <span>{formatCurrency(result.totalSalary)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between rtl:flex-row-reverse">
                  <span className="text-muted-foreground">
                    {t("results.summary.eligibleYears")}
                  </span>
                  <span>{result.eligibleYears}</span>
                </div>
                <div className="flex justify-between rtl:flex-row-reverse">
                  <span className="text-muted-foreground">
                    {t("results.summary.dailyWage")}
                  </span>
                  <span>{formatCurrency(result.totalSalary / 30)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
