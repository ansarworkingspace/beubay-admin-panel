"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormBreadcrumb } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal, Star } from "lucide-react";
import { useSalonRatings, useStylistRatings } from "./controller";
import { ReviewsList } from "./reviews-list";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { cn } from "@/lib/utils";

export default function ReviewsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // URL State
    const activeTab = searchParams.get("type") === "stylist" ? "stylist" : "salon";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const rating = searchParams.get("rating") || "all";

    // Local Search State with debounce
    const [searchValue, setSearchValue] = useState(search);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Params for API
    const apiParams = React.useMemo(() => {
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (rating !== "all") params.rating = rating;
        return params;
    }, [search, rating]);

    // Queries
    const salonQuery = useSalonRatings(page, limit, apiParams);
    const stylistQuery = useStylistRatings(page, limit, apiParams);

    const currentQuery = activeTab === "salon" ? salonQuery : stylistQuery;
    const data = currentQuery.data?.data || [];
    const pagination = currentQuery.data?.pagination;

    // Handlers
    const updateUrl = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === "all" || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        // Reset page on filter change
        if (!newParams.page) params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearch = (val: string) => {
        setSearchValue(val);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            updateUrl({ search: val });
        }, 500);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4">
                <FormBreadcrumb items={["Dashboard", "Reviews & Feedback"]} />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Reviews & Feedback
                    </h1>
                </div>
            </div>

            {/* Premium Tab Switcher */}
            <div className="flex p-1 w-full max-w-[400px] bg-muted/50 rounded-xl border border-border/50 backdrop-blur-sm">
                <button
                    onClick={() => updateUrl({ type: "salon" })}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                        activeTab === "salon" 
                            ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                >
                    Salon Reviews
                </button>
                <button
                    onClick={() => updateUrl({ type: "stylist" })}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg",
                        activeTab === "stylist" 
                            ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                >
                    Stylist Reviews
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40 backdrop-blur-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder="Search feedback text..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-xl"
                    />
                </div>
                <div className="flex gap-4">
                    <Select value={rating} onValueChange={(val) => updateUrl({ rating: val })}>
                        <SelectTrigger className="w-[160px] h-11 bg-background/50 border-border/50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5 text-orange-400" />
                                <SelectValue placeholder="All Ratings" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-background/50 border-border/50">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Main Content Feed */}
            <div className="relative min-h-[400px]">
                {currentQuery.isFetching && (
                    <div className="absolute inset-x-0 -top-1 z-50">
                        <div className="h-0.5 w-full bg-primary/20 overflow-hidden">
                            <div className="h-full bg-primary animate-progress origin-left" />
                        </div>
                    </div>
                )}
                
                <ReviewsList 
                    type={activeTab} 
                    data={data} 
                    isLoading={currentQuery.isLoading} 
                />
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
                <div className="pt-6 border-t border-border/40">
                    <DataTablePagination
                        table={null as any} // Not using standard table, but component supports manual props
                        page={page}
                        setPage={(p) => updateUrl({ page: p.toString() })}
                        limit={limit}
                        setLimit={(l) => updateUrl({ limit: l.toString() })}
                        totalCount={pagination.total}
                    />
                </div>
            )}
        </div>
    );
}
