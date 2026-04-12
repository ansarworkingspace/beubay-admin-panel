"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "../model";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const getColumns = (): ColumnDef<Ticket>[] => [
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
                                <Link href={`/dashboard/tickets/${id}`}>
                                    <Button variant="outline" size="icon" className="w-7 h-7">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>View Ticket</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        }
    },
    {
        accessorKey: "user_id.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.user_id?.name || 'Guest User'}</span>
                <span className="text-xs text-muted-foreground">{row.original.user_id?.email}</span>
            </div>
        )
    },
    {
        accessorKey: "reason",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Reason" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[150px] truncate font-medium">
                {row.original.reason}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            const isOpen = status === "OPEN";
            return (
                <Badge 
                    variant={isOpen ? "default" : "secondary"}
                    className={isOpen 
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200" 
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                    }
                >
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.created_at ? format(new Date(row.original.created_at), "MMM d, yyyy") : 'N/A'}
                <div className="text-[10px] text-muted-foreground">
                    {row.original.created_at ? format(new Date(row.original.created_at), "hh:mm a") : ''}
                </div>
            </div>
        )
    },
    {
        accessorKey: "_id",
        header: "Ticket ID",
        cell: ({ row }) => <span className="font-mono text-[10px] text-muted-foreground">#{row.original._id.substring(row.original._id.length - 6)}</span>
    }
];
