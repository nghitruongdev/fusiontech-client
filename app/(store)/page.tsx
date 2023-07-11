import Banner from "@components/client/Banner";
import ProductList from "@components/client/ProductList";
import { Metadata } from "next";
import { Suspense } from "react";

const metadata: Metadata = {
    title: "FushionTech - Official Store",
    description: "Generated by Create Next App",
    icons: "/favicon.ico",
};
const HomePage = async () => {
    console.debug("Home page rendered");
    return (
        <>
            <main className="">
                <div className="max-w-contentContainer mx-auto">
                    <Suspense>
                        <Banner />
                    </Suspense>
                    <Suspense fallback={<>Loading product list....</>}>
                        <ProductList />
                    </Suspense>
                </div>
            </main>
        </>
    );
};
export default HomePage;
