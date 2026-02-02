"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { useCountries } from "../controller";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountryData } from "../model";
import { usePermissions } from "@/hooks/use-permissions";
import { ACTIONS, MODULES } from "@/lib/constant";

// Placeholder for missing components from user sample, if they don't exist in UI lib yet
// TableHeaderCell removed, using TableHead instead


export function CountryTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [page, setPage] = React.useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl) : 1;
    });

    const [limit, setLimit] = React.useState(() => {
        const limitFromUrl = searchParams.get('limit');
        return limitFromUrl ? parseInt(limitFromUrl) : 10;
    });

    const [searchParamsState, setSearchParamsState] = React.useState<Record<string, string>>({});
    const [columnFilterValues, setColumnFilterValues] = React.useState<Record<string, string>>({});
    const [enableColumnFilters, setEnableColumnFilters] = React.useState(false);

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);



    const currentPage = searchParams.get('page') || '1';
    const currentLimit = searchParams.get('limit') || '10';

    const columns = React.useMemo(
        () => getColumns({
            currentPage,
            currentLimit
        }),
        [currentPage, currentLimit]
    );


    const memoizedSearchParams = React.useMemo(() => searchParamsState, [JSON.stringify(searchParamsState)]);

    const {
        data: countriesResponse,
        isLoading,
        error,
        isFetching,
        refetch
    } = useCountries(page, limit, memoizedSearchParams);

    React.useEffect(() => {
        if (!isLoading && !countriesResponse) {
            refetch();
        }
    }, []);

    const handlePageChange = React.useCallback((newPage: number) => {
        if (newPage >= 1) {
            setPage(newPage);

            const params = new URLSearchParams(searchParams.toString());
            params.set('page', newPage.toString());
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [router, searchParams]);

    const handleLimitChange = React.useCallback((newLimit: number) => {
        if (newLimit && newLimit > 0) {
            setLimit(newLimit);
            setPage(1);

            const params = new URLSearchParams(searchParams.toString());
            params.set('limit', newLimit.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [router, searchParams]);


    const handleSearchChange = React.useCallback(
        (value: string, columnId?: string) => {
            if (!columnId) return;

            setColumnFilterValues((prev) => ({ ...prev, [columnId]: value }));

            setSearchParamsState((prev) => {
                const newParams = { ...prev };
                if (value && value.trim() !== "") {
                    // Basic mapping or direct usage
                    newParams[`${columnId}_like`] = value;
                } else {
                    delete newParams[`${columnId}_like`];
                }
                return newParams;
            });

            setPage(1);
        },
        []
    );

    const clearFilters = React.useCallback(() => {
        setSearchParamsState({});
        setColumnFilterValues({});
        setPage(1);
        toast.success("All filters cleared");
    }, []);

    const tableData = React.useMemo(() => countriesResponse?.data || [], [countriesResponse?.data]);

    const table = useReactTable<CountryData>({
        data: tableData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message={(error as Error).message} />;

    const paginationInfo = countriesResponse?.pagination;
    const hasActiveFilters = Object.keys(searchParamsState).length > 0;

    return (
        <Card>
            <CardHeader className="border-b mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isFetching && (
                            <span className="text-sm text-muted-foreground animate-pulse">
                                Updating...
                            </span>
                        )}
                        <div className="text-sm text-gray-500">
                            Showing {tableData.length || 0} of {paginationInfo?.total || 0} countries
                        </div>
                    </div>
                </div>
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <button
                            onClick={clearFilters}
                            className="text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <DataTableToolbar
                    table={table}
                    searchKey="country_name"
                    searchPlaceholder="Search countries..."
                    onToggleColumnFilters={() => setEnableColumnFilters(!enableColumnFilters)}
                    enableColumnFilters={enableColumnFilters}
                    onSearchChange={handleSearchChange}
                    initialSearchValue={columnFilterValues["country_name"] || ""}
                    addTitle={"Create Country"}
                    url={`/dashboard/utility/country/form/add?page=${currentPage}&limit=${currentLimit}`}
                />

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
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="whitespace-nowrap"
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50 transition-colors">
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
                                        <p className="text-muted-foreground">
                                            {hasActiveFilters
                                                ? "No countries match your search criteria."
                                                : "No countries found."}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {tableData && tableData.length > 0 && (
                    <DataTablePagination
                        table={table}
                        page={page}
                        setPage={handlePageChange}
                        limit={limit}
                        setLimit={handleLimitChange}
                        totalCount={paginationInfo?.total || 0}
                    />
                )}
            </CardContent>
        </Card>
    );
}
