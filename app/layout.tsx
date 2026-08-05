import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/authProvider";


export const metadata: Metadata = {
  title: "Team Access Control",
  description: "Role-based access control system built with Next.js",
  keywords: ['team', 'access control']
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className='min-h-screen bg-slate-950 text-slate'
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  );
}
