"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { Booking, Salon, Stylist } from "../model";
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
}: GetColumnsProps): ColumnDef<Booking>[] {
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
                                    <Link href={`/dashboard/bookings/${id}`}>
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
            accessorKey: "booking_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Booking ID" />
            ),
            cell: ({ row }) => <div className="font-medium text-xs font-mono">{row.getValue("booking_id")}</div>,
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "salon_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Salon" />
            ),
            cell: ({ row }) => {
                const salon = row.original.salon_id as Salon;
                return <div className="font-medium">{salon?.salon_name || "N/A"}</div>;
            },
        },
        {
            accessorKey: "stylist_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Stylist" />
            ),
            cell: ({ row }) => {
                const stylist = row.original.stylist_id as Stylist;
                return <div>{stylist?.name || "N/A"}</div>;
            },
        },
        {
            accessorKey: "booking_date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date & Time" />
            ),
            cell: ({ row }) => {
                const dateStr = row.getValue("booking_date") as string;
                const timeStr = row.original.booking_time;
                try {
                    const date = new Date(dateStr);
                    return (
                        <div className="flex flex-col text-sm">
                            <span>{format(date, "MMM dd, yyyy")}</span>
                            <span className="text-muted-foreground text-xs">{timeStr}</span>
                        </div>
                    );
                } catch (e) {
                    return <div>{dateStr}</div>;
                }
            },
        },
        {
            accessorKey: "booking_status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = (row.getValue("booking_status") as string).toLowerCase();
                let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
                let className = "";

                switch (status) {
                    case "confirmed":
                        variant = "default";
                        className = "bg-green-100 text-green-800 hover:bg-green-100";
                        break;
                    case "cancelled":
                        variant = "destructive";
                        break;
                    case "completed":
                        variant = "secondary";
                        break;
                    case "pending":
                        variant = "outline";
                        className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
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
                    { label: "Confirmed", value: "confirmed" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "Completed", value: "completed" },
                    { label: "Pending", value: "pending" },
                ],
            },
        },
        {
            accessorKey: "total_amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total_amount"));
                const formatted = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(amount);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "payment_status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Payment" />
            ),
            cell: ({ row }) => {
                const status = (row.getValue("payment_status") as string).toLowerCase();
                let className = "";
                switch (status) {
                    case "paid":
                        className = "text-green-600 font-medium";
                        break;
                    case "failed":
                        className = "text-red-600 font-medium";
                        break;
                    case "pending":
                        className = "text-yellow-600 font-medium";
                        break;
                }
                return <div className={`capitalize text-sm ${className}`}>{status}</div>;
            },
            enableColumnFilter: true,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Paid", value: "paid" },
                    { label: "Failed", value: "failed" },
                    { label: "Pending", value: "pending" },
                ],
            },
        },
    ];
}
