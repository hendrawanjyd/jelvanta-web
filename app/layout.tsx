import type { Metadata } from "next";
import {
  Tenor_Sans,
  Lora,
  Plus_Jakarta_Sans,
  Caveat,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const tenor = Tenor_Sans({
  subsets: ["latin"],
  variable: "--font-tenor",
  weight: ["400"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Jelvanta | Seni Menjelajahi Nusantara",
  description:
    "Pengalaman berlibur yang dirancang secara personal untuk setiap langkah perjalanan Anda di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${tenor.variable} ${lora.variable} ${jakarta.variable} ${caveat.variable}`}
    >
      <body className="bg-[#0B2528] text-[#F5F3ED] antialiased selection:bg-[#C6A878] selection:text-[#0B2528]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}