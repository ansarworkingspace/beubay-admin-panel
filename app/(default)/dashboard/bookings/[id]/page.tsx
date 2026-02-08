"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { FormBreadcrumb } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useBookingDetails } from "../controller";
import { Salon, Stylist } from "../model";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, MapPin, User, Scissors, CreditCard, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: booking, isLoading, error } = useBookingDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load booking details" />;
    if (!booking) return <ErrorComponent message="Booking not found" />;

    const salon = booking.salon_id as Salon;
    const stylist = booking.stylist_id as Stylist;

    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Bookings', 'Booking Details']} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold tracking-tight">Booking #{booking.booking_id}</h2>
                        <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'} className="capitalize h-6">
                            {booking.booking_status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3" /> Created on {format(new Date(booking.created_at), "PPP p")}
                    </p>
                </div>
                <div className="flex gap-2">
                    {booking.pg_transaction_id && (
                        <Badge variant="outline" className="px-3 py-1 h-9 text-sm font-mono flex items-center gap-2">
                            <Receipt className="w-3 h-3" /> Trans: {booking.payment_status}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scissors className="w-5 h-5" /> Service Details
                            </CardTitle>
                            <CardDescription>Services requested in this booking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Service Name</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Tax</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {booking.services.map((service) => (
                                            <TableRow key={service._id}>
                                                <TableCell className="font-medium">{service.service_name}</TableCell>
                                                <TableCell className="text-muted-foreground">{service.duration_minutes} min</TableCell>
                                                <TableCell>₹{service.price}</TableCell>
                                                <TableCell>₹{service.tax_amount}</TableCell>
                                                <TableCell className="text-right font-medium">₹{service.total_amount}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={4} className="text-right font-medium pt-4">Subtotal</TableCell>
                                            <TableCell className="text-right font-medium pt-4">₹{booking.subtotal}</TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={4} className="text-right font-medium text-muted-foreground">Total Tax</TableCell>
                                            <TableCell className="text-right font-medium text-muted-foreground">₹{booking.total_tax}</TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent bg-muted/20">
                                            <TableCell colSpan={4} className="text-right font-bold text-lg">Grand Total</TableCell>
                                            <TableCell className="text-right font-bold text-lg text-primary">₹{booking.total_amount}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" /> Customer & Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Customer ID</Label>
                                <div className="font-medium font-mono text-sm bg-muted/50 p-2 rounded border">{booking.user_id}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Scheduled For</Label>
                                <div className="font-medium flex items-center gap-2 p-2 border rounded bg-muted/20">
                                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                    {format(new Date(booking.booking_date), "PPP")} at {booking.booking_time}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> Salon Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {salon?.salon_name?.charAt(0) || "S"}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-semibold">{salon?.salon_name}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{salon?.address || "Address not available"}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{salon?.phone || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">ID:</span>
                                    <span className="font-mono text-xs">{salon?._id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" /> Stylist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                                    {stylist?.name?.charAt(0) || "S"}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-semibold">{stylist?.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {stylist?._id}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Status</span>
                                <Badge variant={booking.payment_status === 'paid' ? 'default' : 'destructive'} className="capitalize">
                                    {booking.payment_status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="capitalize font-medium">{booking.payment_method}</span>
                                </div>
                                {booking.pg_transaction_id && (
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground block">Transaction ID</span>
                                        <Input value={booking.pg_transaction_id} readOnly className="h-8 text-xs font-mono bg-muted" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
