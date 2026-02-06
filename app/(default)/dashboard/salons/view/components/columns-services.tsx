"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { Service } from "@/app/(default)/dashboard/services/model";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const serviceColumns: ColumnDef<Service>[] = [
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const id = row.original._id;
            return (
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`/dashboard/services/view/${id}`}>
                                    <Button variant="outline" size="icon" className="w-7 h-7">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>View Details</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service Name" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "original_price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("original_price"));
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(price);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "duration_minutes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Duration" />
        ),
        cell: ({ row }) => <div>{row.getValue("duration_minutes")} min</div>,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Gender" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.getValue("gender")}
            </Badge>
        ),
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <Badge
                variant={row.getValue("is_active") ? "default" : "destructive"}
                className={row.getValue("is_active") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
                {row.getValue("is_active") ? "Active" : "Inactive"}
            </Badge>
        ),
    },
];
