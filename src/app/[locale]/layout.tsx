import { AppProvider } from "@/contexts/AppContext";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // For Arabic locale, provide Arabic metadata
  if (locale === "ar") {
    return {
      title: "حاسبة مكافأة نهاية الخدمة - الإمارات",
      description:
        "احسب مكافأة نهاية الخدمة وفقاً لقانون العمل الإماراتي المادة 132",
      keywords: "الإمارات، مكافأة، نهاية الخدمة، حاسبة، قانون العمل، توظيف",
      authors: [{ name: "حاسبة مكافأة نهاية الخدمة" }],
      creator: "حاسبة مكافأة نهاية الخدمة",
      publisher: "حاسبة مكافأة نهاية الخدمة",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        type: "website",
        locale: "ar_AE",
        alternateLocale: "en_AE",
        title: "حاسبة مكافأة نهاية الخدمة - الإمارات",
        description: "احسب مكافأة نهاية الخدمة وفقاً لقانون العمل الإماراتي",
        siteName: "حاسبة مكافأة نهاية الخدمة",
      },
      twitter: {
        card: "summary_large_image",
        title: "حاسبة مكافأة نهاية الخدمة - الإمارات",
        description: "احسب مكافأة نهاية الخدمة وفقاً لقانون العمل الإماراتي",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    };
  }

  // Default English metadata
  return {
    title: "UAE Gratuity Calculator - Calculate End of Service Benefits",
    description:
      "Accurate EOSB calculations according to UAE Labor Law Article 132. Calculate your end of service benefits with comprehensive breakdown and analysis.",
    keywords:
      "UAE, gratuity, EOSB, end of service benefits, calculator, labor law, employment, termination",
    authors: [{ name: "UAE Gratuity Calculator" }],
    creator: "UAE Gratuity Calculator",
    publisher: "UAE Gratuity Calculator",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_AE",
      alternateLocale: "ar_AE",
      title: "UAE Gratuity Calculator",
      description:
        "Calculate End of Service Benefits according to UAE Labor Law",
      siteName: "UAE Gratuity Calculator",
    },
    twitter: {
      card: "summary_large_image",
      title: "UAE Gratuity Calculator",
      description:
        "Calculate End of Service Benefits according to UAE Labor Law",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="darkreader-lock" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppProvider>{children}</AppProvider>
          <Toaster
            position={locale === "ar" ? "top-left" : "top-right"}
            dir={locale === "ar" ? "rtl" : "ltr"}
            richColors
            closeButton
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
