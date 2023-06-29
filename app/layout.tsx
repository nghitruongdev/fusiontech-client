import "./globals.css";
import { Inter, Open_Sans } from "next/font/google";
import NextAuthProvider from "@/providers/NextAuthProvider";

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
            <body className={`${inter.className} font-sans`}>
                <NextAuthProvider>{children}</NextAuthProvider>
            </body>
        </html>
    );
}
