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
import { useServiceCategories } from "../controller";
import { ServiceCategoryData } from "../model";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Field Mapping
const FIELD_MAPPING: Record<string, string> = {
    name: "name_like",
    is_active: "is_active",
};

export function ServiceCategoryTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    const [page, setPage] = React.useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl) : 1;
    });

    const [limit, setLimit] = React.useState(() => {
        const limitFromUrl = searchParams.get('limit');
        return limitFromUrl ? parseInt(limitFromUrl) : 10;
    });

    // Initialize filters
    const [columnFilterValues, setColumnFilterValues] = React.useState<Record<string, string>>(() => {
        const filters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') {
                const columnId = Object.keys(FIELD_MAPPING).find(k => FIELD_MAPPING[k] === key);
                if (columnId) {
                    filters[columnId] = columnId === 'is_active' ? (value === 'true' ? 'active' : 'inactive') : value;
                }
            }
        });
        return filters;
    });

    const [enableColumnFilters, setEnableColumnFilters] = React.useState(false);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const currentPage = searchParams.get('page') || '1';
    const currentLimit = searchParams.get('limit') || '10';

    const columns = React.useMemo(() => getColumns({ currentPage, currentLimit }), [currentPage, currentLimit]);

    const memoizedSearchParams = React.useMemo(() => {
        const apiParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') apiParams[key] = value;
        });
        return apiParams;
    }, [searchParams]);

    const { data: responseData, isLoading, error, isFetching, refetch } = useServiceCategories(page, limit, memoizedSearchParams);

    React.useEffect(() => {
        if (!isLoading && !responseData) refetch();
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
        if (newLimit > 0) {
            setLimit(newLimit);
            setPage(1);
            const params = new URLSearchParams(searchParams.toString());
            params.set('limit', newLimit.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [router, searchParams]);

    const handleSearchChange = React.useCallback((value: string, columnId?: string) => {
        if (!columnId) return;
        setColumnFilterValues(prev => ({ ...prev, [columnId]: value }));

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const apiKey = FIELD_MAPPING[columnId];
            if (!apiKey) return;

            let filterValue = value;
            if (columnId === "is_active") {
                // simplified logic vs state/city but assuming consistent
                if (value === 'true') filterValue = 'true';
                else if (value === 'false') filterValue = 'false';
                else if (value === 'all') filterValue = '';
            }

            if (filterValue && filterValue !== 'all') params.set(apiKey, filterValue);
            else params.delete(apiKey);

            params.set('page', '1');
            setPage(1);
            router.push(`?${params.toString()}`, { scroll: false });
        }, 500);
    }, [searchParams, router]);

    const tableData = React.useMemo(() => responseData?.data || [], [responseData?.data]);

    const table = useReactTable<ServiceCategoryData>({
        data: tableData,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters },
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

    const paginationInfo = responseData?.pagination;
    const hasActiveFilters = Object.keys(columnFilterValues).some(k => columnFilterValues[k]);

    return (
        <Card>
            <CardHeader className="border-b mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isFetching && <span className="text-sm text-muted-foreground animate-pulse">Updating...</span>}
                        <div className="text-sm text-gray-500">
                            Showing {tableData.length || 0} of {paginationInfo?.total || 0} categories
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <DataTableToolbar
                    table={table}
                    searchKey="name"
                    searchPlaceholder="Search category..."
                    onToggleColumnFilters={() => setEnableColumnFilters(!enableColumnFilters)}
                    enableColumnFilters={enableColumnFilters}
                    onSearchChange={handleSearchChange}
                    initialSearchValue={columnFilterValues["name"] || ""}
                    addTitle="Create Category"
                    url={`/dashboard/utility/service-category/create?page=${currentPage}&limit=${currentLimit}`}
                    showGlobalSearch={false}
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
                                        <TableHead key={header.id} colSpan={header.colSpan} className="whitespace-nowrap align-top py-2">
                                            <div className="flex flex-col gap-2">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                {enableColumnFilters && header.column.getCanFilter() && (
                                                    <div className="mt-1">
                                                        {(header.column.columnDef.meta as any)?.filterType === 'select' ? (
                                                            <Select
                                                                value={columnFilterValues[header.column.id] || "all"}
                                                                onValueChange={(value) => handleSearchChange(value, header.column.id)}
                                                            >
                                                                <SelectTrigger className="h-8 w-full min-w-[100px]"><SelectValue placeholder="All" /></SelectTrigger>
                                                                <SelectContent>
                                                                    {(header.column.columnDef.meta as any)?.filterOptions?.map((option: any) => (
                                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                placeholder="Filter..."
                                                                value={columnFilterValues[header.column.id] || ""}
                                                                onChange={(e) => handleSearchChange(e.target.value, header.column.id)}
                                                                className="h-8 w-full min-w-[100px]"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-accent transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id} className="py-3 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <p className="text-muted-foreground">{hasActiveFilters ? "No matches." : "No categories found."}</p>
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
