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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-arabic selection:bg-spark-flame selection:text-white">
        {children}
      </body>
    </html>
  );
}
