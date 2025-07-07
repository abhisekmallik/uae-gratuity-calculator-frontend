import { Footer } from "@/components/Footer";
import { GratuityCalculator } from "@/components/GratuityCalculator";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GratuityCalculator />
        </div>
      </main>

      <Footer />
    </div>
  );
}
