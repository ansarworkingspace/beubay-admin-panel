"use client";

import * as React from "react";
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
import { Eye, SquarePen, Power, UserRound } from "lucide-react";
import { Customer } from "../model";
import { useUpdateCustomerStatusMutation } from "../controller";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface GetColumnsProps {
    currentPage: string;
    currentLimit: string;
}

const StatusToggle = ({ customer }: { customer: Customer }) => {
    const updateStatusMutation = useUpdateCustomerStatusMutation();
    const [open, setOpen] = React.useState(false);

    const handleStatusUpdate = () => {
        updateStatusMutation.mutate(
            { id: customer._id, status: !customer.is_active },
            {
                onSuccess: () => {
                    setOpen(false);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={`w-7 h-7 ${customer.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    <Power className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This will {customer.is_active ? 'deactivate' : 'activate'} the user account for {customer.name || customer.phone}.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleStatusUpdate} disabled={updateStatusMutation.isPending}>
                        {updateStatusMutation.isPending ? "Updating..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export function getColumns({
    currentPage,
    currentLimit
}: GetColumnsProps): ColumnDef<Customer>[] {
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

                if (!id) return null;

                const viewUrl = `/dashboard/users/view/${encodeURIComponent(id)}`;
                const editUrl = `/dashboard/users/edit/${encodeURIComponent(id)}`;

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
                                <TooltipContent side="top"><p>Edit User</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <StatusToggle customer={row.original} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>{row.original.is_active ? 'Deactivate' : 'Activate'}</p></TooltipContent>
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
                            alt={row.original.name || "User"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=?'; }}
                        />
                    ) : (
                        <UserRound className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name || "-"}</div>
                    {/* Optional: Add a subtle hint if name is missing */}
                </div>
            ),
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Phone" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span>{row.original.phone}</span>
                    {row.original.is_phone_verified && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 text-green-600 border-green-200 bg-green-50">Verified</Badge>
                    )}
                </div>
            ),
            enableColumnFilter: true,
            meta: { filterType: "text" },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span>{row.original.email || "-"}</span>
                    {row.original.email && row.original.is_email_verified && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 text-green-600 border-green-200 bg-green-50">Verified</Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({ row }) => <div className="capitalize">{row.original.gender || "-"}</div>,
            meta: {
                filterType: "select",
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
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
                    variant={row.original.is_active ? "default" : "secondary"}
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
