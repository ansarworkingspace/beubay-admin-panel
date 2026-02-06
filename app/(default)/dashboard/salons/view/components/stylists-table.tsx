"use client";

import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { stylistColumns } from "./columns-stylists";
import { useSalonStylists } from "../../controller";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";

import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StylistsTableProps {
    salonId: string;
}


export function StylistsTable({ salonId }: StylistsTableProps) {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);

    const { data: responseData, isLoading, error, isFetching } = useSalonStylists(salonId, page, limit);

    const tableData = React.useMemo(() => responseData?.data || [], [responseData?.data]);
    const paginationInfo = responseData?.pagination;

    const table = useReactTable({
        data: tableData,
        columns: stylistColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: paginationInfo?.pages || 0,
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message={(error as Error).message} />;

    return (
        <Card>
            <CardHeader className="border-b mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isFetching && <span className="text-sm text-muted-foreground animate-pulse">Updating...</span>}
                        <div className="text-sm text-gray-500">
                            Showing {tableData.length || 0} of {paginationInfo?.total || 0} stylists
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                                        colSpan={stylistColumns.length}
                                        className="h-24 text-center"
                                    >
                                        No stylists found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {tableData && tableData.length > 0 && paginationInfo && (
                    <DataTablePagination
                        table={table as any}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalCount={paginationInfo.total}
                    />
                )}
            </CardContent>
        </Card>
    );
}
