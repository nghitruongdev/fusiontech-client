export const ckMerge = (classList: string) =>
    classList
        .split(" ")
        .map((className) => {
            return className.includes(":")
                ? className.replace(":", ":!")
                : `!${className}`;
            // className.indexOf(":") ? "" : `!${className}`;
        })
        .join(" ");
