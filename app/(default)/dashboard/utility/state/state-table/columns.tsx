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
import { StateData } from "../model";
import { useToggleStateStatus } from '../controller';

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<StateData>[] {
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
                const toggleStatusMutation = useToggleStateStatus();
                const stateId = row.original._id || row.original.id;

                if (!stateId) {
                    return (
                        <div className="text-red-500 text-xs">
                            No Valid ID
                        </div>
                    );
                }

                const viewUrl = `/dashboard/utility/state/view/${encodeURIComponent(stateId)}`;
                const editUrl = `/dashboard/utility/state/form/${encodeURIComponent(stateId)}`;

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
                                <TooltipContent side="top">
                                    <p>View State Details</p>
                                </TooltipContent>
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
                                <TooltipContent side="top">
                                    <p>Edit State</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={`w-15 h-7 ${row.original.is_active ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}`}
                                        onClick={() => toggleStatusMutation.mutate({ id: stateId, currentStatus: row.original.is_active })}
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
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="State Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium min-w-[150px]">{row.original.name}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "country_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Country" />
            ),
            cell: ({ row }) => (
                <div className="min-w-[100px]">{row.original.country_name || "-"}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "state_code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="State Code" />
            ),
            cell: ({ row }) => (
                <div className="min-w-[80px] font-mono">{row.original.state_code}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
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
                    className={row.original.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
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
