"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { DataTableToolbar } from "@/components/shared/table/data-table-toolbar";
import { getColumns } from "./columns";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useTickets } from "../controller";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Ticket } from "../model";

export function TicketsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';

    const { data: responseData, isLoading, error, isFetching } = useTickets(page, limit, status);

    const columns = React.useMemo(() => getColumns(), []);

    const tableData = React.useMemo(() => responseData?.data.data || [], [responseData?.data.data]);
    const paginationInfo = responseData?.data.pagination;

    const table = useReactTable<Ticket>({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleLimitChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', newLimit.toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleStatusFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete('status');
        } else {
            params.set('status', value);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message={(error as Error).message} />;

    return (
        <Card>
            <CardHeader className="border-b mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isFetching && <span className="text-sm text-muted-foreground animate-pulse">Updating...</span>}
                        <div className="text-sm text-gray-500">
                            Showing {tableData.length || 0} of {paginationInfo?.total || 0} tickets
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                    <DataTableToolbar
                        table={table}
                        showGlobalSearch={false}
                    />
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <Select value={status} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="All Tickets" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tickets</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="rounded-md border bg-card overflow-x-auto relative">
                    {isFetching && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        </div>
                    )}
                    <Table className="min-w-max">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap py-2 font-semibold">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {tableData.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <p className="text-muted-foreground">No tickets found.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {tableData.length > 0 && paginationInfo && (
                    <DataTablePagination
                        table={table}
                        page={page}
                        setPage={handlePageChange}
                        limit={limit}
                        setLimit={handleLimitChange}
                        totalCount={paginationInfo.total}
                    />
                )}
            </CardContent>
        </Card>
    );
}
