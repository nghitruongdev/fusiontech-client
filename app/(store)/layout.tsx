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
    return (
        <>
            <RefineProvider>
                {/* <Header /> */}
                {/* <Link href="/test">Go to test</Link> */}
                <main>{children}</main>
                {/* <Footer /> */}
            </RefineProvider>
        </>
    );
}
