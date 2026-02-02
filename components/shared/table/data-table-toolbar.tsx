"use client"

import { Table } from "@tanstack/react-table"
import { X, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchKey?: string
    searchPlaceholder?: string
    enableColumnFilters?: boolean
    onToggleColumnFilters?: () => void
    onSearchChange?: (value: string, columnId?: string) => void
    initialSearchValue?: string
    addTitle?: string
    url?: string
    children?: React.ReactNode
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Filter...",
    enableColumnFilters = false,
    onToggleColumnFilters,
    onSearchChange,
    initialSearchValue = "",
    addTitle,
    url,
    children
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    {searchKey && (
                        <Input
                            placeholder={searchPlaceholder}
                            value={initialSearchValue ?? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                table.getColumn(searchKey)?.setFilterValue(value);
                                onSearchChange?.(value, searchKey);
                            }}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    )}

                    {children}

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
                <div className="flex items-center space-x-2">
                    {addTitle && url && (
                        <Link href={url}>
                            <Button size="sm" className="h-8">
                                <Plus className="mr-2 h-4 w-4" />
                                {addTitle}
                            </Button>
                        </Link>
                    )}

                    <DataTableViewOptions table={table} />
                </div>
            </div>
        </div>
    )
}
