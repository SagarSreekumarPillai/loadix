import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lodix - AI-Powered Logistics Platform",
  description: "Streamline EU logistics with AI intelligence, route optimization, and compliance automation",
  keywords: ["logistics", "AI", "EU", "supply chain", "optimization", "compliance"],
  authors: [{ name: "Lodix Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">🚀 Lodix</h3>
                  <p className="text-gray-400 text-sm">
                    AI-powered logistics platform designed for EU market challenges and compliance requirements.
                  </p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                    <li><a href="/orders/new" className="hover:text-white">Order Management</a></li>
                    <li><a href="/tracking" className="hover:text-white">Shipment Tracking</a></li>
                    <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>AI Route Optimization</li>
                    <li>Demand Forecasting</li>
                    <li>EU Compliance</li>
                    <li>CO₂ Tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Contact</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>📧 support@lodix.eu</li>
                    <li>📞 +32 2 123 4567</li>
                    <li>📍 Brussels, Belgium</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2024 Lodix. All rights reserved. Built for the EU logistics community.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
