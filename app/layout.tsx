import "./globals.css";
import { Inter, Open_Sans } from "next/font/google";
import NextAuthProvider from "@components/layout/providers/NextAuthProvider";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });
const open_sans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open_sans",
});
export const metadata = {
    title: "FusionTech Online Store",
    description: "Cửa hàng thương mại thiết bị điện tử",
};

const DynamicAuthProvider = dynamic(
    () => import("@components/layout/providers/NextAuthProvider"),
    { ssr: false },
);
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} font-sans`}>
                <DynamicAuthProvider>{children}</DynamicAuthProvider>
                {/* <NextAuthProvider>{children}</NextAuthProvider> */}
            </body>
        </html>
    );
}
