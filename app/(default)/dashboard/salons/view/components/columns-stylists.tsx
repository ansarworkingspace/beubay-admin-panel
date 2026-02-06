"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { Stylist } from "@/app/(default)/dashboard/stylist/model";
import { Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const stylistColumns: ColumnDef<Stylist>[] = [
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
                                <Link href={`/dashboard/stylist/view/${id}`}>
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
            <DataTableColumnHeader column={column} title="Stylist Name" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {row.original.profile_image ? (
                        <img src={row.original.profile_image} alt={row.original.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs">{row.original.name.charAt(0)}</span>
                    )}
                </div>
                <div className="font-medium">{row.getValue("name")}</div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
        accessorKey: "experience_years",
        header: "Experience",
        cell: ({ row }) => <div>{row.getValue("experience_years")} Years</div>,
    },
    {
        accessorKey: "average_rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{Number(row.getValue("average_rating")).toFixed(1)}</span>
                <span className="text-muted-foreground text-xs">({row.original.total_ratings})</span>
            </div>
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
