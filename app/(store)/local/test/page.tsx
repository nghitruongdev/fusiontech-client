"use client";

import { useList } from "@refinedev/core";

const page = () => {
    const { data, status } = useList({
        resource: "cart",
        dataProviderName: "firestore",
    });

    return (
        <div>
            Test page: status {status}, data: {JSON.stringify(data)}
        </div>
    );
};
export default page;
