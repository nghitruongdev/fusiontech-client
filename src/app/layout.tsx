import Navbar from "@components/layout/Navbar";
import "./globals.css";
import { Inter, Open_Sans } from "next/font/google";
import Footer from "@components/layout/Footer";
import { NextAuthProvider } from "./providers";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import { API_URL } from "@/constants";
import RefineLayout from "./RefineLayout";

const inter = Inter({ subsets: ["latin"] });
const open_sans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open_sans",
});
export const metadata = {
    title: "FusionTech Online Store",
    description: "Cửa hàng thương mại thiết bị điện tử",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${open_sans.variable} font-sans`}>
                <RefineLayout>
                    <NextAuthProvider>
                        <Navbar />
                    </NextAuthProvider>
                    <main>{children}</main>
                    <Footer />
                </RefineLayout>
            </body>
        </html>
    );
}
