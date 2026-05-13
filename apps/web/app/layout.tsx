import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strade & Servizi | Controllo Cantieri",
  description: "Gestionale Edile con architettura SOLID e design Lusso Caldo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 8px 24px rgba(0,58,125,0.12)',
            },
            success: {
              style: {
                background: '#003A7D',
                color: '#fff',
              },
              iconTheme: { primary: '#DFFF00', secondary: '#003A7D' },
            },
            error: {
              style: {
                background: '#fff',
                color: '#991b1b',
                border: '1px solid #fecaca',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

