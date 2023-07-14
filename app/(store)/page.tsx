import Banner from "@components/client/Banner";
import ProductList from "@components/store/front/ProductList";
import { Skeleton } from "@components/ui/Skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

const metadata: Metadata = {
    title: "FushionTech - Official Store",
    description: "Generated by Create Next App",
    icons: "/favicon.ico",
};
const array = Array.from({ length: 20 });
const ProductLoading = () => {
    return (
        <div className="flex">
            {array.map((_, idx) => (
                <div key={idx} className="min-w-[20%] grid gap-2 p-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-6" />
                    <Skeleton className="h-6" />
                    <Skeleton className="h-6" />
                </div>
            ))}
        </div>
    );
};
const HomePage = async () => {
    return (
        <>
            <main className="">
                <div className="max-w-contentContainer mx-auto">
                    <Suspense>
                        <Banner />
                    </Suspense>
                    <Suspense fallback={<ProductLoading />}>
                        <ProductList />
                    </Suspense>
                </div>
            </main>
        </>
    );
};
export default HomePage;
