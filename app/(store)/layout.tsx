import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";

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
            {/* <Suspense fallback={<Loading />}> */}
            <Header />
            <main>{children}</main>
            <Footer />
            {/* </Suspense> */}
        </>
    );
}
