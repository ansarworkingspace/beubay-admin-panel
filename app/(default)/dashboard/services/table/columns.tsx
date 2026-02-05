"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen } from "lucide-react";
import { Service } from "../model";
import { useToggleServiceStatus } from "../controller";

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<Service>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            enableColumnFilter: false,
            cell: ({ row }) => {
                const id = row.original._id;
                const toggleStatusMutation = useToggleServiceStatus();

                if (!id) return null;

                const viewUrl = `/dashboard/services/view/${encodeURIComponent(id)}`;
                const editUrl = `/dashboard/services/edit/${encodeURIComponent(id)}`;

                return (
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={viewUrl}>
                                        <Button variant="outline" size="icon" className="w-7 h-7">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>View Details</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={editUrl}>
                                        <Button variant="outline" size="icon" className="w-7 h-7">
                                            <SquarePen className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>Edit Service</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={`w-15 h-7 ${row.original.is_active ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}`}
                                        onClick={() => toggleStatusMutation.mutate({ id, currentStatus: row.original.is_active })}
                                        disabled={toggleStatusMutation.isPending}
                                    >
                                        {row.original.is_active ? "Active" : "Inactive"}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>{row.original.is_active ? "Deactivate" : "Activate"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
        },
        {
            accessorKey: "image_url",
            header: "Image",
            enableColumnFilter: false,
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                    {row.original.image_url ? (
                        <img
                            src={row.original.image_url}
                            alt={row.original.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=?'; }}
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">Img</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Service Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
            ),
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "salon_id.salon_name",
            id: "salon_name",
            header: "Salon",
            cell: ({ row }) => <div>{row.original.salon_id?.salon_name || "-"}</div>,
        },
        {
            accessorKey: "original_price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Price" />
            ),
            cell: ({ row }) => <div>{row.original.original_price}</div>,
        },
        {
            accessorKey: "discount_percentage",
            header: "Disc %",
            cell: ({ row }) => <div>{row.original.discount_percentage}%</div>,
        },
        {
            accessorKey: "final_price",
            header: "Final Price",
            cell: ({ row }) => <div className="font-bold">{row.original.final_price}</div>,
        },
        {
            accessorKey: "duration_minutes",
            header: "Duration (min)",
            cell: ({ row }) => <div>{row.original.duration_minutes}</div>,
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({ row }) => <Badge variant="outline">{row.original.gender}</Badge>,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Unisex", value: "unisex" },
                ],
            },
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => (
                <Badge
                    variant={row.original.is_active ? "default" : "destructive"}
                    className={row.original.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                    {row.original.is_active ? "Active" : "Inactive"}
                </Badge>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                ],
            },
        }
    ];
}
