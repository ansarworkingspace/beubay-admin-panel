"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    BookOpen,
    Users,
    Store,
    Scissors,
    DollarSign,
    TrendingUp,
    ChevronRight,
    Trophy,
    Percent,
    MapPin,
    CalendarDays
} from "lucide-react";
import { useAnalyticsSummary } from "./controller";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsOverview() {
    const [period, setPeriod] = useState("month");
    const [stagedDates, setStagedDates] = useState({ start: "", end: "" });
    const [activeRange, setActiveRange] = useState({ start: "", end: "" });
    
    const { data, isLoading, isPlaceholderData } = useAnalyticsSummary(
        period, 
        period === "custom" ? activeRange.start : undefined, 
        period === "custom" ? activeRange.end : undefined
    );

    const handleApplyCustomRange = () => {
        if (stagedDates.start && stagedDates.end) {
            setActiveRange(stagedDates);
        }
    };

    const bookingRate = data ? (data.bookings.confirmed / data.bookings.total) * 100 : 0;
    const revenueRate = data ? (data.transactions.completed_amount / data.transactions.total_amount) * 100 : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Top Bar with Period Selector (ALWAYS VISIBLE) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-sans tracking-tight">Executive Dashboard</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                            {period === "custom" 
                                ? (activeRange.start ? `${activeRange.start} to ${activeRange.end}` : "Select a range and click Apply")
                                : `Analytics for last ${period}`
                            }
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    {period === "custom" && (
                        <div className="flex items-center gap-2 bg-background/50 border rounded-xl p-1 shadow-sm animate-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center px-2">
                                <input 
                                    type="date" 
                                    value={stagedDates.start}
                                    onChange={(e) => setStagedDates(prev => ({ ...prev, start: e.target.value }))}
                                    className="bg-transparent text-[11px] font-bold outline-none uppercase"
                                />
                                <span className="mx-2 text-muted-foreground">/</span>
                                <input 
                                    type="date" 
                                    value={stagedDates.end}
                                    onChange={(e) => setStagedDates(prev => ({ ...prev, end: e.target.value }))}
                                    className="bg-transparent text-[11px] font-bold outline-none uppercase"
                                />
                            </div>
                            <Button 
                                onClick={handleApplyCustomRange}
                                size="sm"
                                variant="default"
                                className="h-8 rounded-lg text-[10px] font-black uppercase px-4"
                                disabled={!stagedDates.start || !stagedDates.end}
                            >
                                Apply Range
                            </Button>
                        </div>
                    )}
                    <div className="inline-flex items-center p-1 bg-background/50 border rounded-lg shadow-sm">
                        {["today", "week", "month", "year", "custom"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-semibold capitalize rounded-md transition-all",
                                    period === p 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <AnalyticsSkeleton />
            ) : !data ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-card rounded-2xl border border-dashed">
                    <p>No data available for the selected period.</p>
                </div>
            ) : (
                <>
                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard 
                            title="Total Bookings" 
                            value={data.bookings.total} 
                            subtext={`Confirmed: ${data.bookings.confirmed}`}
                            icon={<BookOpen className="h-5 w-5 text-purple-600" />}
                            progress={bookingRate}
                        />
                        <MetricCard 
                            title="Gross Revenue" 
                            value={`$${data.transactions.completed_amount.toLocaleString()}`} 
                            subtext={`Failed: $${(data.transactions.total_amount - data.transactions.completed_amount).toLocaleString()}`}
                            icon={<DollarSign className="h-5 w-5 text-green-600" />}
                            progress={revenueRate}
                        />
                        <MetricCard 
                            title="App Scale" 
                            value={data.platform.total_salons} 
                            subtext={`${data.platform.total_stylists} Total Stylists`}
                            icon={<Store className="h-5 w-5 text-blue-600" />}
                            progress={100}
                        />
                        <MetricCard 
                            title="Services" 
                            value={data.platform.total_service_categories} 
                            subtext="Available Categories"
                            icon={<Scissors className="h-5 w-5 text-orange-600" />}
                            progress={100}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Platform Efficiency */}
                        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-card">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Platform Efficiency</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 grid gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Booking Confirmation Rate</p>
                                            <p className="text-2xl font-bold">{bookingRate.toFixed(1)}%</p>
                                        </div>
                                        <Percent className="h-8 w-8 text-purple-600/20" />
                                    </div>
                                    <Progress value={bookingRate} className="h-2 bg-muted transition-all duration-1000" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                                    <div className="space-y-2 p-4 rounded-xl border bg-muted/20 text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirmed</p>
                                        <p className="text-2xl font-black">{data.bookings?.confirmed ?? 0}</p>
                                    </div>
                                    <div className="space-y-2 p-4 rounded-xl border bg-muted/20 text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">In Review</p>
                                        <p className="text-2xl font-black text-orange-500">{data.bookings?.initiated ?? 0}</p>
                                    </div>
                                    <div className="space-y-2 p-4 rounded-xl border bg-muted/20 text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stylists</p>
                                        <p className="text-2xl font-black text-blue-500">{data.platform?.total_stylists ?? 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Categories */}
                        <Card className="border-none shadow-sm bg-card">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg">Market Demand</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {(!data.most_used_service_categories || data.most_used_service_categories.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-xs italic">
                                        No service data for this period
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {data.most_used_service_categories.map((cat, idx) => (
                                            <div key={cat.name} className="flex items-center gap-4 group cursor-default">
                                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-muted text-sm font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between">
                                                        <p className="text-sm font-bold">{cat.name}</p>
                                                        <p className="text-[10px] font-black uppercase text-muted-foreground">{cat.count} Units</p>
                                                    </div>
                                                    <Progress 
                                                        value={data.most_used_service_categories[0]?.count ? (cat.count / data.most_used_service_categories[0].count) * 100 : 0} 
                                                        className="h-1.5 bg-muted" 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <VerticalLeaderboard 
                            title="Volume Leaders" 
                            description="Ranked by total bookings"
                            items={(data.most_booked_salons || []).map(s => ({ 
                                label: s.salon_name, 
                                value: `${s.count} Bookings`,
                                icon: <MapPin className="h-3.5 w-3.5" />
                            }))}
                        />
                        <VerticalLeaderboard 
                            title="Revenue Leaders" 
                            description="Top grossing establishments"
                            items={(data.most_revenued_salons || []).map(s => ({ 
                                label: s.salon_name, 
                                value: `$${s.total_revenue.toLocaleString()}`,
                                icon: <DollarSign className="h-3.5 w-3.5" />
                            }))}
                        />
                        <Card className="border-none shadow-sm overflow-hidden bg-card">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Power Users</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {(!data.most_booked_users || data.most_booked_users.length === 0) ? (
                                    <div className="flex items-center justify-center py-12 text-muted-foreground text-xs italic">
                                        No user activity recorded
                                    </div>
                                ) : (
                                    data.most_booked_users.map((user, idx) => (
                                        <div key={user.name} className="flex items-center gap-3 px-6 py-4 border-b last:border-0 hover:bg-muted/10 transition-colors">
                                            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                <AvatarImage src={user.profile_image} />
                                                <AvatarFallback className="text-xs font-bold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{user.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black">Top Contributor</p>
                                            </div>
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-xs font-black text-primary">
                                                {user.count}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

function MetricCard({ title, value, subtext, icon, progress }: any) {
    return (
        <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-all duration-300 bg-card overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-muted flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-black truncate">{value}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{subtext}</p>
                </div>
            </CardContent>
            {/* Subtle bottom indicator */}
            <div className="h-1 bg-muted w-full overflow-hidden">
                <div
                    className="h-full bg-primary/40"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </Card>
    );
}

function VerticalLeaderboard({ title, description, items }: any) {
    return (
        <Card className="border-none shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30">
                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {items.map((item: any, idx: number) => (
                    <div key={item.label} className="flex items-center gap-4 px-6 py-[14px] border-b last:border-0 hover:bg-muted/10 transition-colors cursor-default">
                        <div className={cn(
                            "flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-black",
                            idx === 0 ? "bg-yellow-400/20 text-yellow-600" : "bg-muted text-muted-foreground"
                        )}>
                            {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{item.label}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-primary/80">
                            {item.value}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2 text-2xl font-bold font-sans tracking-tight">Analytics Loading...</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                <Skeleton className="h-[400px] rounded-xl" />
            </div>
        </div>
    );
}
