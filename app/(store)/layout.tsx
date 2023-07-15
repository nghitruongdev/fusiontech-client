import { Portal } from "@chakra-ui/react";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import RefineProvider from "@components/layout/providers/RefineProvider";
import Link from "next/link";

export const metadata = {
    title: "FusionTech Online Store",
    description: "Cửa hàng thương mại thiết bị điện tử",
};

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <RefineProvider>
                <Header />
                <Link href="/test">Go to test</Link>
                <main>{children}</main>
                <Footer />
            </RefineProvider>
        </>
    );
}
