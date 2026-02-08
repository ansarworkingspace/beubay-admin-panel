"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { Transaction } from "../model";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<Transaction>[] {
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
                return (
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/dashboard/transactions/${id}`}>
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
            accessorKey: "order_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Order ID" />
            ),
            cell: ({ row }) => <div className="font-medium text-xs font-mono">{row.getValue("order_id")}</div>,
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "booking_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Booking ID" />
            ),
            cell: ({ row }) => {
                const booking = row.original.booking_id;
                if (!booking || typeof booking === "string") return <div>{booking || "N/A"}</div>;

                return (
                    <Link href={`/dashboard/bookings/${booking._id}`} className="text-blue-600 hover:underline text-xs font-mono">
                        {booking.booking_id}
                    </Link>
                );
            },
        },
        {
            accessorKey: "salon_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Salon" />
            ),
            cell: ({ row }) => {
                const salon = row.original.salon_id;
                return <div className="font-medium">{salon?.salon_name || "N/A"}</div>;
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const currency = row.original.currency || "INR";
                const formatted = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: currency,
                }).format(amount);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "gateway",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Gateway" />
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("gateway")}</div>,
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = (row.getValue("status") as string).toLowerCase();
                let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
                let className = "";

                switch (status) {
                    case "success":
                        variant = "default";
                        className = "bg-green-100 text-green-800 hover:bg-green-100";
                        break;
                    case "failed":
                        variant = "destructive";
                        break;
                    case "pending":
                        variant = "outline";
                        className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
                        break;
                    case "refunded":
                        variant = "secondary";
                        break;
                    case "initiated":
                        variant = "outline";
                        className = "text-blue-600 border-blue-200 bg-blue-50";
                        break;
                    default:
                        break;
                }

                return (
                    <Badge variant={variant} className={`capitalize ${className}`}>
                        {status}
                    </Badge>
                );
            },
            enableColumnFilter: true,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Success", value: "success" },
                    { label: "Failed", value: "failed" },
                    { label: "Pending", value: "pending" },
                    { label: "Refunded", value: "refunded" },
                    { label: "Initiated", value: "initiated" },
                ],
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => {
                try {
                    return (
                        <div className="text-sm">
                            {format(new Date(row.getValue("created_at")), "MMM dd, yyyy HH:mm")}
                        </div>
                    );
                } catch (e) {
                    return <div>{row.getValue("created_at")}</div>;
                }
            },
        },
    ];
}
