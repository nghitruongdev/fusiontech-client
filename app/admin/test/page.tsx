"use client";

import useNotification from "@/hooks/useNotification";

const page = () => {
    return <Component />;
};

const Component = () => {
    const { open } = useNotification();

    const handleChange = (event: any) => {
        open({
            type: event.target.value,
            title: event.target.value,
        });
    };
    return (
        <>
            <select onChange={handleChange}>
                {["loading", "error", "success", "info", "warning"].map(
                    (item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ),
                )}
            </select>
        </>
    );
};
export default page;
