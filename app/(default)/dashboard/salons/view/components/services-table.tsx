"use client";

import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { serviceColumns } from "./columns-services";
import { useSalonServices } from "../../controller";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";

interface ServicesTableProps {
    salonId: string;
}

export function ServicesTable({ salonId }: ServicesTableProps) {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);

    const { data: responseData, isLoading, error, isFetching } = useSalonServices(salonId, page, limit);

    const tableData = React.useMemo(() => responseData?.data || [], [responseData?.data]);
    const paginationInfo = responseData?.pagination;

    const table = useReactTable({
        data: tableData,
        columns: serviceColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: paginationInfo?.pages || 0,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message={(error as Error).message} />;

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={serviceColumns.length}
                                    className="h-24 text-center"
                                >
                                    No services found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {paginationInfo && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing {tableData.length} of {paginationInfo.total} services
                    </div>
                    {/* Simplified Pagination Controls could replace DataTablePagination if it's too tied to URL params */}
                    <div className="flex items-center space-x-2">
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            {"<"}
                        </button>
                        <div className="text-sm font-medium">
                            Page {page} of {paginationInfo.pages}
                        </div>
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                            onClick={() => setPage((p) => Math.min(paginationInfo.pages, p + 1))}
                            disabled={page >= paginationInfo.pages}
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
