import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import RefineProvider from "@components/layout/providers/RefineProvider";

export const metadata = {
    title: "FusionTech Online Store",
    description: "Cửa hàng thương mại thiết bị điện tử",
};

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    console.debug("Store Layout rendered");
    return (
        <>
            <RefineProvider>
                <Header />
                <main>{children}</main>
                <Footer />
            </RefineProvider>
        </>
    );
}
