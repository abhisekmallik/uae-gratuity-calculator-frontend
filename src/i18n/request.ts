import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Validate locale and fallback to default if invalid
  const validLocales = ["en", "ar"];
  const requestLocale = locale && validLocales.includes(locale) ? locale : "en";

  try {
    const messages = (await import(`../../messages/${requestLocale}.json`))
      .default;

    return {
      locale: requestLocale,
      messages,
    };
  } catch (error) {
    console.error(
      `Failed to load messages for locale ${requestLocale}:`,
      error
    );
    // Fallback to English if messages fail to load
    const fallbackMessages = (await import(`../../messages/en.json`)).default;
    return {
      locale: "en",
      messages: fallbackMessages,
    };
  }
});
