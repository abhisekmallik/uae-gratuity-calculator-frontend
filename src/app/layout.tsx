import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UAE EOSB Calculator",
  description: "Calculate End of Service Benefits (EOSB) according to UAE Labor Law Article 132",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
