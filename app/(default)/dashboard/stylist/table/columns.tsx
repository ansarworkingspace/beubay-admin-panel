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
import { Stylist } from "../model";
import { useToggleStylistStatus } from "../controller";

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<Stylist>[] {
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
                const toggleStatusMutation = useToggleStylistStatus();

                if (!id) return null;

                const viewUrl = `/dashboard/stylist/view/${encodeURIComponent(id)}`;
                const editUrl = `/dashboard/stylist/edit/${encodeURIComponent(id)}`;

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
                                <TooltipContent side="top"><p>Edit Stylist</p></TooltipContent>
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
            accessorKey: "profile_image",
            header: "Image",
            enableColumnFilter: false,
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded-full border bg-muted overflow-hidden flex items-center justify-center">
                    {row.original.profile_image ? (
                        <img
                            src={row.original.profile_image}
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
                <DataTableColumnHeader column={column} title="Stylist Name" />
            ),
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            ),
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "salon_id.salon_name",
            id: "salon_name",
            header: "Salon",
            cell: ({ row }) => {
                const salon = row.original.salon_id;
                return <div>{typeof salon === 'object' && salon ? salon.salon_name : "-"}</div>
            },
        },
        {
            accessorKey: "service_category_ids",
            header: "Skills",
            cell: ({ row }) => {
                const categories = row.original.service_category_ids;
                if (!Array.isArray(categories) || categories.length === 0) return "-";

                // Show first 2 categories and +X more
                const displayLimit = 2;
                const visible = categories.slice(0, displayLimit);
                const remaining = categories.length - displayLimit;

                return (
                    <div className="flex flex-wrap gap-1">
                        {visible.map((cat: any) => (
                            <Badge key={cat?._id || Math.random()} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                {cat?.name || "Unknown"}
                            </Badge>
                        ))}
                        {remaining > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">+{remaining}</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "experience_years",
            header: "Exp (Yrs)",
            cell: ({ row }) => <div className="text-center">{row.original.experience_years}</div>,
        },
        {
            accessorKey: "average_rating",
            header: "Rating",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span>{row.original.average_rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({row.original.total_ratings})</span>
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
