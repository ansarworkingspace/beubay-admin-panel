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
import { toast } from "sonner";
import { CountryData } from "../model";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 1. Field Mapping
const FIELD_MAPPING: Record<string, string> = {
    name: "name_like",
    phone_code: "phone_code_like",
    currency: "currency_like",
    country_code: "country_code_like",
    is_active: "is_active", // Exact match
};

export function CountryTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Debounce timer ref
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    const [page, setPage] = React.useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl) : 1;
    });

    const [limit, setLimit] = React.useState(() => {
        const limitFromUrl = searchParams.get('limit');
        return limitFromUrl ? parseInt(limitFromUrl) : 10;
    });

    // Initialize filters from URL
    const [columnFilterValues, setColumnFilterValues] = React.useState<Record<string, string>>(() => {
        const filters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') {
                // Reverse mapping or just use checks. 
                // Since URL params are backend-keys (e.g. name_like), we need to map them back to columnId if we want to show them in specific inputs?
                // Or we can just store them as is. 
                // The inputs need to control specific column IDs.
                // Let's iterate FIELD_MAPPING to find keys.
                const columnId = Object.keys(FIELD_MAPPING).find(k => FIELD_MAPPING[k] === key);
                if (columnId) {
                    if (columnId === 'is_active') {
                        filters[columnId] = value === 'true' ? 'active' : 'inactive';
                    } else {
                        filters[columnId] = value;
                    }
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

    const columns = React.useMemo(
        () => getColumns({
            currentPage,
            currentLimit
        }),
        [currentPage, currentLimit]
    );

    // Prepare search params for API
    const memoizedSearchParams = React.useMemo(() => {
        const apiParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') {
                apiParams[key] = value;
            }
        });
        return apiParams;
    }, [searchParams]);

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

    // 2. Search Handler Logic
    const handleSearchChange = React.useCallback(
        (value: string, columnId?: string) => {
            if (!columnId) return;

            // Update local state immediately for UI 
            setColumnFilterValues((prev) => ({ ...prev, [columnId]: value }));

            // Debounce URL update
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString());
                const apiKey = FIELD_MAPPING[columnId];

                if (!apiKey) return;

                let filterValue = value;
                const trimmedValue = value.trim();

                // Special Case for Status
                if (columnId === "is_active") {
                    // Since input for status is likely a select, value might be "active"/"inactive" or "all"
                    // If it's a text input (unlikely for status but possible), we handle parsing.
                    // The user snippet handles text parsing.
                    const lowerValue = trimmedValue.toLowerCase();
                    if ("active".startsWith(lowerValue) && lowerValue.length > 0) {
                        filterValue = "true";
                    } else if ("inactive".startsWith(lowerValue)) {
                        filterValue = "false";
                    } else if (value === 'all') {
                        filterValue = "";
                    }
                    // If using a Select, value comes in as 'true'/'false'/'all' directly maybe?
                    // Let's assume the Select passes 'true'/'false'.
                    if (value === 'true') filterValue = 'true';
                    if (value === 'false') filterValue = 'false';
                    if (value === 'all') filterValue = '';
                }

                if (filterValue && filterValue !== "" && filterValue !== 'all') {
                    params.set(apiKey, filterValue);
                } else {
                    params.delete(apiKey);
                }

                // Reset page on filter change
                params.set('page', '1');
                setPage(1);

                router.push(`?${params.toString()}`, { scroll: false });
            }, 500);
        },
        [searchParams, router]
    );

    const clearFilters = React.useCallback(() => {
        setColumnFilterValues({});
        setPage(1);
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('limit', limit.toString());
        router.push(`?${params.toString()}`, { scroll: false });
        toast.success("All filters cleared");
    }, [limit, router]);

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
    const hasActiveFilters = Object.keys(columnFilterValues).some(k => columnFilterValues[k]);

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
                {/* Remove global search logic from here if we are moving to columns. 
                     Or keep the "Add" button here. */}
            </CardHeader>

            <CardContent className="space-y-4">
                <DataTableToolbar
                    table={table}
                    searchKey="name"
                    searchPlaceholder="Search countries..."
                    onToggleColumnFilters={() => setEnableColumnFilters(!enableColumnFilters)}
                    enableColumnFilters={enableColumnFilters}
                    onSearchChange={handleSearchChange} // This prop might not be used if toolbar is just for toggle now
                    initialSearchValue={columnFilterValues["name"] || ""}
                    addTitle={"Create Country"}
                    url={`/dashboard/utility/country/form/add?page=${currentPage}&limit=${currentLimit}`}
                    showGlobalSearch={false} // Assume I update toolbar to hide global search if needed, or I ignore it
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
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="whitespace-nowrap align-top py-2"
                                            >
                                                <div className="flex flex-col gap-2">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

                                                    {/* Column Filter Input */}
                                                    {enableColumnFilters && header.column.getCanFilter() && (
                                                        <div className="mt-1">
                                                            {(header.column.columnDef.meta as any)?.filterType === 'select' ? (
                                                                <Select
                                                                    value={columnFilterValues[header.column.id] || "all"}
                                                                    onValueChange={(value) => handleSearchChange(value, header.column.id)}
                                                                >
                                                                    <SelectTrigger className="h-8 w-full min-w-[100px]">
                                                                        <SelectValue placeholder="All" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(header.column.columnDef.meta as any)?.filterOptions?.map((option: any) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Input
                                                                    placeholder={`Filter...`}
                                                                    value={columnFilterValues[header.column.id] || ""}
                                                                    onChange={(e) => handleSearchChange(e.target.value, header.column.id)}
                                                                    className="h-8 w-full min-w-[100px]"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-accent transition-colors">
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
