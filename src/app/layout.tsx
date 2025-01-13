import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/app/thirdweb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Gimp NFT Membership Rewards Program",
    description: "Gimp NFT Membership Rewards",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* ✅ Added viewport meta tag for better mobile scaling */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className={inter.className} style={{ margin: 0, padding: 0, boxSizing: "border-box", overflowX: "hidden" }}>
                {/* ✅ Added a container wrapper for better mobile layout control */}
                <ThirdwebProvider>
                    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        {children}
                    </main>
                </ThirdwebProvider>
            </body>
        </html>
    );
}
