"use client"

import { Table } from "@tanstack/react-table"
import { X, Plus, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    searchPlaceholder?: string;
    enableColumnFilters?: boolean;
    onToggleColumnFilters?: () => void;
    onSearchChange?: (value: string, columnId?: string) => void;
    initialSearchValue?: string;
    addTitle?: string;
    url?: string;
    showGlobalSearch?: boolean; // New prop
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Filter...", // Kept default from original, but instruction implies it might be removed. Sticking to instruction's placeholder usage.
    enableColumnFilters = false, // Kept default from original
    onToggleColumnFilters,
    onSearchChange,
    initialSearchValue = "",
    addTitle,
    url,
    showGlobalSearch = true // Default to true
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [searchValue, setSearchValue] = React.useState(initialSearchValue);

    React.useEffect(() => {
        setSearchValue(initialSearchValue);
    }, [initialSearchValue]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (onSearchChange && searchKey) {
            onSearchChange(value, searchKey);
        } else if (searchKey) {
            table.getColumn(searchKey)?.setFilterValue(value);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {showGlobalSearch && searchKey && (
                    <Input
                        placeholder={searchPlaceholder || "Search..."}
                        value={searchValue}
                        onChange={(event) => handleSearch(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}

                {onToggleColumnFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleColumnFilters}
                        className="h-8 border-dashed"
                    >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                        {enableColumnFilters && <span className="ml-1 text-xs text-muted-foreground">(On)</span>}
                    </Button>
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />

            {addTitle && url && (
                <Link href={url}>
                    <Button size="sm" className="ml-2 h-8">
                        <Plus className="mr-2 h-4 w-4" />
                        {addTitle}
                    </Button>
                </Link>
            )}
        </div>
    );
}
