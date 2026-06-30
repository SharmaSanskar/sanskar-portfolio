import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
import { ThemeToggle } from "./components/ThemeToggle";
import { Cursor } from "./components/Cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "Portfolio - Sanskar Sharma",
  description: "A software engineer blending creativity and code",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <Cursor />
        <ThemeToggle />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}