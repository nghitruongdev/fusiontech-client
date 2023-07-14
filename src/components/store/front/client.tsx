"use client";

import { useBoolean } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const FavoriteButton = () => {
    const [isFavorited, { toggle }] = useBoolean(Math.random() > 0.5);
    const [isBouncing, { on: startBouncing, off: stopBouncing }] = useBoolean();

    const onClick = () => {
        if (isFavorited) return;
        startBouncing();
        setTimeout(() => {
            toggle();
            stopBouncing();
        }, 5000);
    };
    return (
        <div
            onClick={onClick}
            className={`absolute ${
                !isFavorited ? "opacity-0 group-hover:opacity-100" : ""
            } ${isBouncing ? "animate-pulse !duration-1000" : ""}
            ${"active:animate-ping"} top-1 right-2 group-hover:bg-white rounded-full p-1 duration-300 ease-in-out`}
        >
            <Heart
                className={`text-sm w-5 h-5 font-bold text-rose-500  ${
                    isFavorited ? "fill-current" : ""
                }`}
            />
        </div>
    );
};
