"use client";

import { useLocale, useTranslations } from "next-intl";

export function LanguageTest() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="p-4 border border-red-500 m-4">
      <h3>Language Test Component</h3>
      <p>Current locale: {locale}</p>
      <p>App title: {t("app.title")}</p>
      <p>App subtitle: {t("app.subtitle")}</p>
      <p>Form basic salary label: {t("form.basicSalary.label")}</p>
      <p>Test timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
