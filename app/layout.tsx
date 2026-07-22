import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og.png`;

  return {
    title: "Мифический уровень 16 ♡",
    description: "Маленький мир и большое поздравление для самой особенной девушки.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Мифический уровень 16",
      description: "Для самой особенной девушки ♡",
      type: "website",
      images: [{ url: ogImage, width: 1536, height: 1024, alt: "Мифический уровень 16" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Мифический уровень 16",
      description: "Для самой особенной девушки ♡",
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
