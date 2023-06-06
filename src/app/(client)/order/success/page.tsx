import Link from "next/link";

const page = () => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-2xl text-hoverBg font-semibold">
                Thank you for shopping with us.
            </h1>
            <Link
                href="/"
                className="text-lg text-lightText hover:underline underline-offset-4 decoration-[1px] hover:text-blue duration-300"
            >
                Continue to shopping
            </Link>
        </div>
    );
};
export default page;
