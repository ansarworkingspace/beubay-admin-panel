"use client";
import React from "react";

export const Error = ({ message }: { message: string }) => {
    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-2">
            <div className="text-destructive text-4xl font-bold">Error</div>
            <p className="text-muted-foreground">{message}</p>
        </div>
    );
};
