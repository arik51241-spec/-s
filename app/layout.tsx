import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Твоя глава 16 • 13 августа",
  description: "Личная праздничная Gacha-история для самой особенной девушки.",
  openGraph: {
    title: "Твоя глава 16",
    description: "13 августа открывается новая глава 💜",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
