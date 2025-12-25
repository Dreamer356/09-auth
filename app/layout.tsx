import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/Providers/QueryProvider";
import AuthProvider from "../components/AuthProvider/AuthProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub - Управління нотатками",
  description: "Сучасний додаток для створення та управління вашими нотатками з категоріями та пошуком",
  keywords: ["нотатки", "замітки", "організація", "продуктивність"],
  authors: [{ name: "NoteHub Team" }],
  openGraph: {
    title: "NoteHub - Управління нотатками",
    description: "Сучасний додаток для створення та управління вашими нотатками з категоріями та пошуком",
    url: "https://08-zustand-gilt.vercel.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Додаток для управління нотатками",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
