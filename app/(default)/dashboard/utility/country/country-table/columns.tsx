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
import { CountryData } from "../model";
import { ACTIONS, MODULES } from "@/lib/constant";
import { useToggleCountryStatus } from '../controller';

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<CountryData>[] {
    const canEdit = true;
    const canView = true;

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
                const toggleStatusMutation = useToggleCountryStatus();
                const countryId = row.original._id || row.original.id; // Handle both

                if (!countryId) {
                    return (
                        <div className="text-red-500 text-xs">
                            No Valid ID
                        </div>
                    );
                }

                const queryParams = `?page=${currentPage}&limit=${currentLimit}`;
                const viewUrl = `/dashboard/utility/country/view/${encodeURIComponent(countryId)}${queryParams}`;
                const editUrl = `/dashboard/utility/country/form/${encodeURIComponent(countryId)}${queryParams}`;

                return (
                    <div className="flex items-center gap-2">
                        {canView && (
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
                                        <p>View Country Details</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {canEdit && (
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
                                        <p>Edit Country</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {canEdit && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className={`w-15 h-7 ${row.original.status == 'active' ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}`}
                                            onClick={() => toggleStatusMutation.mutate(countryId)}
                                            disabled={toggleStatusMutation.isPending}
                                        >
                                            {row.original.status == 'active' ? "Active" : "Inactive"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>{row.original.status == 'active' ? "Deactivate" : "Activate"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "country_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Country Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium min-w-[150px]">{row.original.country_name}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "phone_code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Phone Code" />
            ),
            cell: ({ row }) => (
                <div className="min-w-[100px]">{row.original.phone_code}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "currency_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Currency Name" />
            ),
            cell: ({ row }) => (
                <div className="min-w-[100px]">{row.original.currency_name}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "currency_code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Currency Code" />
            ),
            cell: ({ row }) => (
                <div className="min-w-[80px] font-mono">{row.original.currency_code}</div>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "text",
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === 'active' ? "default" : "destructive"}
                    className={row.original.status === 'active' ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
                >
                    {row.original.status === 'active' ? "Active" : "Inactive"}
                </Badge>
            ),
            enableColumnFilter: true,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                ],
            },
        }
    ];
}
