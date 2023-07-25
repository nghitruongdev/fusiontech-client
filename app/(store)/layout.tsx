import RefineProvider from "@components/layout/providers/RefineProvider";
import dynamic from "next/dynamic";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
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
                {/* <Link href="/test">Go to test</Link> */}
                <main>{children}</main>
                <Footer />
            </RefineProvider>
        </>
    );
}
