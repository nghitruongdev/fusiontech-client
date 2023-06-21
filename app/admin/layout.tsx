"use client";

import { ThemedLayoutV2 } from "@refinedev/chakra-ui";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ThemedLayoutV2>{children}</ThemedLayoutV2>;
}
