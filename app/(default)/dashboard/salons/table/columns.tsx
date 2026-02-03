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
import { Eye, SquarePen, BadgeCheck } from "lucide-react";
import { Salon } from "../model";
import { useToggleSalonStatus } from '../controller';

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<Salon>[] {
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
                const toggleStatusMutation = useToggleSalonStatus();
                // Handle both _id and id just in case
                const id = row.original._id || (row.original as any).id;

                if (!id) return null;

                const viewUrl = `/dashboard/salons/view/${encodeURIComponent(id)}`;
                const editUrl = `/dashboard/salons/edit/${encodeURIComponent(id)}`;

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
                                <TooltipContent side="top"><p>Edit Salon</p></TooltipContent>
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
            accessorKey: "logo_url",
            header: "Logo",
            enableColumnFilter: false,
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded-full border bg-muted overflow-hidden flex items-center justify-center">
                    {row.original.logo_url ? (
                        <img
                            src={row.original.logo_url}
                            alt={row.original.salon_name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=?'; }}
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">Log</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "salon_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Salon Name" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{row.original.salon_name}</span>
                    {row.original.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                </div>
            ),
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "owner_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Owner" />
            ),
            cell: ({ row }) => <div>{row.original.owner_name}</div>,
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Phone" />
            ),
            cell: ({ row }) => <div>{row.original.phone}</div>,
        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Address" />
            ),
            cell: ({ row }) => <div className="max-w-[200px] truncate" title={row.original.address}>{row.original.address}</div>,
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
