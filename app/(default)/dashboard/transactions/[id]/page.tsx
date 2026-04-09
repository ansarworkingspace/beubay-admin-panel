"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { FormBreadcrumb } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useTransactionDetails } from "../controller";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Hash, Link as LinkIcon, Server, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function TransactionDetailsPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: transaction, isLoading, error } = useTransactionDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load transaction details" />;
    if (!transaction) return <ErrorComponent message="Transaction not found" />;

    const booking = typeof transaction.booking_id === 'object' ? transaction.booking_id : null;
    const salon = transaction.salon_id;

    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Transactions', 'Transaction Details']} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold tracking-tight">Order #{transaction.order_id}</h2>
                        <Badge variant={transaction.status === 'success' ? 'default' : transaction.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize h-6 text-sm px-3">
                            {transaction.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <ArrowUpRight className="w-3 h-3 text-green-500" /> Processed on {format(new Date(transaction.created_at), "PPP p")}
                    </p>
                </div>
                <div className="bg-muted/30 px-4 py-2 rounded-lg border flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">{transaction.currency} {transaction.amount}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="w-5 h-5" /> Transaction Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Order ID</Label>
                                <div className="font-mono text-sm border p-2 rounded bg-muted/30 break-all">{transaction.order_id}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Internal Transaction ID</Label>
                                <div className="font-mono text-sm border p-2 rounded bg-muted/30 break-all">{transaction._id}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Gateway</Label>
                                <div className="flex items-center gap-2 font-medium capitalize border p-2 rounded bg-muted/30">
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                    {transaction.gateway}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">User ID</Label>
                                <div className="font-mono text-sm border p-2 rounded bg-muted/30 break-all">{transaction.user_id || "N/A"}</div>
                            </div>
                        </CardContent>
                    </Card>


                </div>

                {/* Right Column: References */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5" /> Related Entities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Associated Booking</Label>
                                {booking ? (
                                    <Link href={`/dashboard/bookings/${booking._id}`} className="block group">
                                        <div className="border rounded-md p-3 transition-colors hover:border-primary/50 hover:bg-muted/50">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium group-hover:text-primary transition-colors">{booking.booking_id}</span>
                                                <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="text-xs text-muted-foreground">Click to view booking details</div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic">No booking linked</div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Salon</Label>
                                <div className="flex items-center gap-3 border p-3 rounded-md">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {salon?.salon_name?.charAt(0) || "S"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-medium text-sm truncate">{salon?.salon_name}</div>
                                        <div className="text-xs text-muted-foreground font-mono truncate">{salon?._id}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
