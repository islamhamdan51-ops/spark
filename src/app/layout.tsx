import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK | شرارة — منصة الأنشطة التفاعلية وتيسير المجموعات",
  description: "أشعل البداية مع مجموعتك في دقائق. اختر نشاطك، اعرض الشاشة أو الـ QR، وتفاعلوا فوراً بدون تسجيل.",
  keywords: ["شرارة", "SPARK", "أنشطة جماعية", "كسر الجمود", "تيسير ورش العمل", "أنشطة أطفال", "أنشطة إسلامية", "مسابقات"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
  openGraph: {
    title: "SPARK | شرارة — منصة الأنشطة التفاعلية الفورية",
    description: "تختار لك النشاط المناسب وتبدأه مع مجموعتك خلال دقائق بدون تطبيقات أو تسجيل.",
    type: "website",
    locale: "ar_AR",
  },
};

import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col font-arabic selection:bg-[#C9ECFF] selection:text-[#17324D] ${cairo.className}`}>
        {children}
      </body>
    </html>
  );
}
